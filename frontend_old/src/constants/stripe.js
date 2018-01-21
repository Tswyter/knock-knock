const STRIPE_PUBLISHABLE = process.env.NODE_ENV === 'production'
  ? 'pk_live_45Q0JAIT6HpONX1ZvPjjhlH8'
  : 'pk_test_acYpsKVm5y1UXmHcdvcdUXyK';

export default STRIPE_PUBLISHABLE;