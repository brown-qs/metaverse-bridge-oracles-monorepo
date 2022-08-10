import React, { useState } from 'react';
import { useClasses } from 'hooks';
import { styles } from './Filters.style';
import { MOONSAMA_TRAITS } from 'utils/constants';
import { OrderType } from 'utils/subgraph';
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Button, Slider, Tag, Text } from '@chakra-ui/react';
import { ChevronDown, Filter } from 'tabler-icons-react';

export interface Filters {
  priceRange: number[];
  traits: string[];
  selectedOrderType: OrderType | undefined;
}

interface Props {
  onFiltersUpdate: (x: Filters) => void;
}

export const Filters = ({ onFiltersUpdate }: Props) => {
  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number[]>([1, 400]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType | undefined>(undefined);
  const {
    filtersDrawerContent,
    applyFiltersButton,
    filterAccordion,
    accordionHeader,
    accordionContent,
    filterChip,
    priceRangeWrapper,
    filtersTitle,
  } = useClasses(styles);

  const handleApplyFilters = () => {
    onFiltersUpdate({
      selectedOrderType,
      traits: selectedTraits,
      priceRange,
    });
    setIsDrawerOpened(false);
  };

  const handlePriceRangeChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setPriceRange(newValue as number[]);
  };

  const handleOrderTypeClick = (orderType: OrderType | undefined) => {
    setSelectedOrderType(orderType)
  };

  const handleTraitClick = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(
        selectedTraits.filter((selectedTrait) => selectedTrait !== trait)
      );

      return;
    }

    setSelectedTraits([...selectedTraits, trait]);
  };

  return (
    <>
      <Button
        onClick={() => setIsDrawerOpened(true)}
        //startIcon={<Filter />}
        variant="outlined"
        color="primary"
      >
        Filter
      </Button>
      <Box
      /*
        anchor="left"
         hideBackdrop
        open={isDrawerOpened}
        onClose={() => setIsDrawerOpened(false)}
        onOpen={() => setIsDrawerOpened(true)}*/
      >
        <Text variant="h6" className={filtersTitle}>
          Filters
        </Text>
        <div className={filtersDrawerContent}>
          <div>
            <Accordion /*defaultExpanded square*/ className={filterAccordion}>
              <AccordionItem>
                <AccordionButton
                /* expandIcon={<ChevronDown />}
                 aria-controls="panel1a-content"
                 id="panel1a-header"*/
                >
                  <Text className={accordionHeader}>Order Type</Text>
                </AccordionButton>
                <AccordionPanel>
                  <div className={accordionContent}>
                    <Tag
                      // label="Active buy order"
                      variant="outlined"
                      onClick={() => handleOrderTypeClick(OrderType.BUY)}
                      className={`${filterChip} ${selectedOrderType == OrderType.BUY && 'selected'}`} />
                    <Tag
                      // label="Active sell order"
                      variant="outlined"
                      onClick={() => handleOrderTypeClick(OrderType.SELL)}
                      className={`${filterChip} ${selectedOrderType == OrderType.SELL && 'selected'}`} />
                    <Tag
                      //  label="None"
                      variant="outlined"
                      onClick={() => handleOrderTypeClick(undefined)}
                      className={`${filterChip} ${selectedOrderType == undefined && 'selected'}`} />
                  </div>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Accordion /*defaultExpanded square*/ className={filterAccordion}>
              <AccordionItem>

                <AccordionButton
                /* expandIcon={<ExpandMoreIcon />}
                 aria-controls="panel2a-content"
                 id="panel2a-header"*/
                >
                  <Text className={accordionHeader}>Price</Text>
                </AccordionButton>
                <AccordionPanel>
                  <Slider
                  /*
                    getAriaLabel={() => 'Price range'}
                  
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={5000}
                  sx={{
                    "& .MuiSlider-thumb": {
                      color: "#710021",
                    },
                    "& .MuiSlider-track": {
                      color: '#710021'
                    },
                    "& .MuiSlider-rail": {
                      color: '#c5c5c5'
                    }
                  }}*/
                  />
                  <div className={priceRangeWrapper}>
                    <div>{`${priceRange[0]} MOVR`}</div>
                    <div>{`${priceRange[1]} MOVR`}</div>
                  </div>
                </AccordionPanel>
              </AccordionItem>

            </Accordion>
            <Accordion /*defaultExpanded square*/ className={filterAccordion}>
              <AccordionItem>

                <AccordionButton
                /*
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"*/
                >
                  <Text className={accordionHeader}>Traits</Text>
                </AccordionButton>
                <AccordionPanel>
                  <div className={accordionContent}>
                    {Object.keys(MOONSAMA_TRAITS).map((trait) => (
                      <Tag
                        //label={trait}
                        variant="outlined"
                        onClick={() => handleTraitClick(trait)}
                        className={`${filterChip} ${selectedTraits.includes(trait) && 'selected'
                          }`}
                      />
                    ))}
                  </div>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Button
              className={applyFiltersButton}
              onClick={handleApplyFilters}
              variant="contained"
              color="primary"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Box>
    </>
  );
};
