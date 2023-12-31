
export const styles = (theme: any) => ({
  balanceContainer: {
    [theme.breakpoints.down(500)]: {
      display: 'none',
    },
    paddingRight: '.4rem',
    flexWrap: 'nowrap',
    flexFlow: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balance: {
    marginRight: '5px',
  },
});
