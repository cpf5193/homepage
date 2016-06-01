var Suffix = {
  getCountingSuffix: function(n) {
    switch(n) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  },

  addCountingSuffix: function(n) {
    var lastDigit = n % 10,
        suffix = this.getCountingSuffix(lastDigit);
    return n + suffix;
  },

  niceNumber: function(n) {
    // We should keep the current value if it's a NaN or "Infinity".
    if (!_.isNumber(n)) {
      n = Number(n);
    }
    if (n === Infinity || n === -Infinity || _.isNaN(n)) {
      return n;
    }
    if( Math.abs(n) >= 1000000000000 ) {
      return (Math.round((Math.round(n) / 1000000000000) * 10) / 10) + 'T';
    } else if( Math.abs(n) >= 1000000000 ) {
      return (Math.round((Math.round(n) / 1000000000) * 10) / 10) + 'B';
    } else if( Math.abs(n) >= 1000000 ) {
      return (Math.round((Math.round(n) / 1000000) * 10) / 10) + 'M';
    } else if( Math.abs(n) >= 1000 ) {
      return (Math.round(((Math.round(n) / 1000) * 10)) / 10) + 'K';
    }
    return Math.round((n * 10) / 10).toString();
  }
}