var _ = require('underscore');
var test = require('tape');
var fs = require('fs');
var moment = require('moment');

import {
  normalize,
  epochify,
  mapNetworkLines,
  mapNetworkPhoneConnectionAttempts,
  startDateTime,
  timerange,
  timeAxis,
  duration
} from '../src/parser';

// path is relative to the root of the project

epochify(
  normalize(fs.readFileSync('./testdata/network.txt', 'utf8')),
  (err, log) => {
    test('should extract phone connection attempts', assert => {
      if (err) {
        console.log(err);
        assert.fail();
      }

      const startTimestamp = moment(
        startDateTime(log),
        'HH:mm:ss YYYY-MM-DD'
      ).unix();

      const trange = timerange(startTimestamp, duration(log));

      const tAxisTimeSeries = timeAxis(
        trange.startMilliseconds,
        trange.endMilliseconds
      );

      const actual = mapNetworkPhoneConnectionAttempts(
        mapNetworkLines(log),
        tAxisTimeSeries
      );

      const expectedLength = 20;

      assert.ok(actual);

      assert.true(actual.count() > 0);

      assert.true(actual.count() === expectedLength);

      assert.true(actual.max() === 1);

      assert.end();
    });
  }
);
