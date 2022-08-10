import * as React from 'react';


import { useClasses } from 'hooks';
import { styles } from './TransferList.styles';
import { Box, Button, Checkbox, Divider, Grid, List, ListIcon, ListItem } from '@chakra-ui/react';
import { DeviceGamepad, ListDetails, Wallet } from 'tabler-icons-react';

function not(a: readonly string[], b: readonly string[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly string[], b: readonly string[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly string[], b: readonly string[]) {
    return [...a, ...not(b, a)];
}

export const TransferList = () => {
    const [checked, setChecked] = React.useState<readonly string[]>([]);
    const [left, setLeft] = React.useState<readonly string[]>(['MSAMA #511', 'Resource 1', 'Resource 3']);
    const [right, setRight] = React.useState<readonly string[]>(['MSAMA #35', 'MSAMA #205', 'Resource 2', 'Resource 3']);

    const { columnTitle, columnTitleText, paperStyles, listItemStyles, listItemTextStyles, listItemHeader, transferButton } = useClasses(styles);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items: readonly string[]) =>
        intersection(checked, items).length;

    const handleToggleAll = (items: readonly string[]) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (title: React.ReactNode, items: readonly string[]) => (
        <Box className={paperStyles}>
            <Box
                className={listItemHeader}
                sx={{ px: 2, py: 1, bgcolor: '#111' }}
            /* avatar={
                 <Checkbox
                     onClick={handleToggleAll(items)}
                     checked={numberOfChecked(items) === items.length && items.length !== 0}
                       indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                     disabled={items.length === 0}
                     inputProps={{
                         'aria-label': 'all items selected',
                     }}
                 />
             }
             //  title={title}*/
            // subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{
                    width: 250,
                    height: 250,
                    bgcolor: '#111',
                    overflow: 'auto',
                }}

                as="div"
                role="list"
            >
                {items.map((value: string) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem
                            key={value}
                            className={listItemStyles}
                            role="listitem"
                            //button
                            onClick={handleToggle(value)}
                        >
                            <ListIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}

                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListIcon>
                            <ListDetails id={labelId} className={listItemTextStyles} /*primary={value}*/ />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Box>
    );

    return (
        <Grid justifyContent="flex-start" alignItems="center">
            <Grid /*item*/>
                <div className={columnTitle}><DeviceGamepad /> <span className={columnTitleText}>In-Game Assets</span></div>
                {customList(``, left)}
            </Grid>
            <Grid /*item*/>
                <Grid alignItems="center">
                    <Button
                        className={transferButton}
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        className={transferButton}
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid /*item*/>
                <div className={columnTitle}><Wallet /> <span className={columnTitleText}>Wallet Assets</span></div>
                {customList('', right)}
            </Grid>
        </Grid>
    );
}