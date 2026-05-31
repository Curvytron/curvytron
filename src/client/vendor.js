// Vendor entry — bundled by Vite into web/js/dependencies.js (IIFE).
// Replaces the old Bower `dependencies.js`: pulls every third-party library
// from npm and exposes it on `window`, so the concatenated first-party bundle
// (curvytron.js) can reference them as free globals, exactly like the original build.

// Angular + plugins self-register on window.angular
import 'angular';
import 'angular-route';
import 'angular-cookies';
import 'angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js';

// SoundJS exposes window.createjs (needs the this.createjs fix in vite.config.js)
import 'createjs-soundjs/lib/soundjs-0.6.2.min.js';

import EventEmitter from 'tom32i-event-emitter.js';
import { GamepadListener, GamepadHandler } from 'gamepad.js';
import { Asset, SpriteAsset, SoundAsset } from 'tom32i-asset-loader.js';
import { InputListener, Mapper, KeyboardMapper, GamepadMapper, TouchMapper } from '../vendor/key-mapper.js';

Object.assign(window, {
    EventEmitter,
    GamepadListener,
    GamepadHandler,
    Asset,
    SpriteAsset,
    SoundAsset,
    InputListener,
    Mapper,
    KeyboardMapper,
    GamepadMapper,
    TouchMapper,
});
