
export const styles = (theme: any) => ({
  columnTitle: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 0 16px 0',
    color: '#d2023e',
  },
  columnTitleText: {
    fontFamily: `VT323, 'arial'`,
    fontSize: '21px',
    display: 'block',
    margin: '0 0 0 8px !important',
  },
  paperStyles: {
    borderRadius: '0 !important',
  },
  listItemHeader: {
    '& div > span': {
      color: '#fff',
    },
  },
  listItemStyles: {
    '& svg': {
      fill: '#f5f5f5',
    },
  },
  listItemTextStyles: {
    color: '#f5f5f5 !important',

    '& span': {
      fontFamily: `VT323, 'arial'`,
      fontSize: '21px',
    },
  },
  transferButton: {
    color: '#fff !important',
    borderColor: '#fff !important',
  },
});
