import { BASIC_DEVICE } from './constants';

import titleCase from './titleCase';

import deviceTypes from '../types/devices.json';

import toArray from './toArray';

const _ = require('underscore');

const MAX_DEVICES = 4;

/**
 * Returns an array of paired ant+ devices
 * where each element of the array is an object with the following properties
 * {
 *  deviceId: <string>,
 *  channel: <string>,
 }
 * @param {[string]} lines - an array of log lines, or string
 */

const antDeviceRegex = /^\[[^\]]*\]\s+?ant\s+?:\s+?pairing\sdeviceid.*$/i;

export default function antDevices(lines) {
  const result = [];

  if (!lines) {
    return result;
  }

  const antLines = Array.isArray(lines) ? lines : toArray(lines);

  const pairings = [];

  _.each(antLines, line => {
    antDeviceRegex.test(line) && pairings.push(line);
  });

  if (!pairings.length) {
    console.log('no ant pairing deviceId lines found');
    return result;
  }

  const j = pairings.length;

  // stop when we have found at least MAX_DEVICES or looked at all pairings
  for (let i = 0; i <= MAX_DEVICES; i += 1) {
    if (i > j) {
      break;
    }

    const d = pairings[i];

    if (d) {
      // not using the mfg or ant network id anymore
      const matches = d.match(
        /^\[[^\]]*\]\s+?ant\s+?:\s+?pairing\sdeviceid\s([\d]*)\sto\schannel\s([\d]*).*$/i
      );

      if (!matches) {
        console.log(
          'Failed to extract deviceId and channel from ant pairing deviceId line'
        );
        break;
      }

      let deviceId = 0;

      try {
        deviceId = parseInt(matches[1], 10);
      } catch (e) {
        console.log('Failed to convert deviceId to number');
      }

      const channel = matches[2];

      if (!deviceId || !channel) {
        console.log('Failed to get values for ant deviceId, channel');
      }

      const device = {
        deviceId,
        channel,
        extendedDeviceId: '',
        manufacturerId: '',
        manufacturer: '',
        modelId: '',
        model: '',
        type: BASIC_DEVICE,
        typeName: titleCase(deviceTypes[BASIC_DEVICE])
      };

      const exisingDeviceFound = _.find(result, existingDevice => {
        return existingDevice.deviceId === device.deviceId;
      });

      if (!exisingDeviceFound) {
        result.push(device);
      }
    }
  }

  return Object.freeze(result);
}
