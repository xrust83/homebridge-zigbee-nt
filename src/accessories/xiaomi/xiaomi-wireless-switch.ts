import { ZigBeeAccessory } from '../zig-bee-accessory';
import { Service } from 'homebridge';
import { DeviceState } from '../../zigbee/types';
import { Device } from 'zigbee-herdsman/dist/controller/model';
import { ProgrammableSwitchServiceBuilder } from '../../builders/programmable-switch-service-builder';

export class XiaomiWirelessSwitch extends ZigBeeAccessory {
  protected switchServiceSinglePress: Service;
  protected switchServiceDoublePress: Service;
  protected switchServiceLongPress: Service;

  getAvailableServices(): Service[] {
    const builder = new ProgrammableSwitchServiceBuilder(
      this.platform,
      this.accessory,
      this.client,
      this.state
    );

    const ProgrammableSwitchEvent = this.platform.Characteristic.ProgrammableSwitchEvent;
  
[
  this.switchServiceSinglePress, 
  this.switchServiceDoublePress, 
  this.switchServiceLongPress] = builder
      .withStatelessSwitch('ON', 'on', 1, [
        ProgrammableSwitchEvent.SINGLE_PRESS,
        ProgrammableSwitchEvent.DOUBLE_PRESS,
        ProgrammableSwitchEvent.LONG_PRESS,
      ])
      .andBattery()
      .build();

    return [
      this.switchServiceSinglePress, 
      this.switchServiceDoublePress, 
      this.switchServiceLongPress
    ];
  }

  update(device: Device, state: DeviceState) {
    const ProgrammableSwitchEvent = this.platform.Characteristic.ProgrammableSwitchEvent;
    super.update(device, state);
    switch (state.click) {
      case 'brightness_up':
        this.switchServiceOn
          .getCharacteristic(ProgrammableSwitchEvent)
          .setValue(ProgrammableSwitchEvent.LONG_PRESS);
        break;
      case 'brightness_down':
        this.switchServiceOff
          .getCharacteristic(ProgrammableSwitchEvent)
          .setValue(ProgrammableSwitchEvent.LONG_PRESS);
        break;
      case 'on':
        this.switchServiceOn
          .getCharacteristic(ProgrammableSwitchEvent)
          .setValue(ProgrammableSwitchEvent.SINGLE_PRESS);
        break;
      case 'off':
        this.switchServiceOff
          .getCharacteristic(ProgrammableSwitchEvent)
          .setValue(ProgrammableSwitchEvent.SINGLE_PRESS);
        break;
    }
  }
}
