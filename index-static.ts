/* tslint:disable */
/* eslint-disable */
/* prettier-ignore */

import type {
  AsyncFileDialog,
  AsyncMessageDialog,
  FileDialog,
  FileHandle,
  MessageButtons,
  MessageDialog,
  MessageLevel
} from './index';

export type RfdBinding = {
  AsyncFileDialog: typeof AsyncFileDialog;
  AsyncMessageDialog: typeof AsyncMessageDialog;
  FileDialog: typeof FileDialog;
  FileHandle: typeof FileHandle;
  MessageButtons: typeof MessageButtons;
  MessageDialog: typeof MessageDialog;
  MessageLevel: typeof MessageLevel;
};

/**
 * Load native bindings for Darwin (macOS) ARM64
 * Use this for Apple Silicon Macs (M1, M2, etc.)
 */
export function loadDarwinArm64(): RfdBinding {
  return require('./index.darwin-arm64.node');
}

/**
 * Load native bindings for Darwin (macOS) x64
 * Use this for Intel Macs
 */
export function loadDarwinX64(): RfdBinding {
  return require('./index.darwin-x64.node');
}

/**
 * Load native bindings for Darwin (macOS) Universal
 * Use this for universal macOS binaries
 */
export function loadDarwinUniversal(): RfdBinding {
  return require('./index.darwin-universal.node');
}

/**
 * Load native bindings for Windows x64
 */
export function loadWin32X64(): RfdBinding {
  return require('./index.win32-x64-msvc.node');
}

/**
 * Load native bindings for Windows x86
 */
export function loadWin32Ia32(): RfdBinding {
  return require('./index.win32-ia32-msvc.node');
}

/**
 * Load native bindings for Windows ARM64
 */
export function loadWin32Arm64(): RfdBinding {
  return require('./index.win32-arm64-msvc.node');
}

/**
 * Load native bindings for Linux x64 (glibc)
 */
export function loadLinuxX64Gnu(): RfdBinding {
  return require('./index.linux-x64-gnu.node');
}

/**
 * Load native bindings for Linux x64 (musl)
 */
export function loadLinuxX64Musl(): RfdBinding {
  return require('./index.linux-x64-musl.node');
}

/**
 * Load native bindings for Linux ARM64 (glibc)
 */
export function loadLinuxArm64Gnu(): RfdBinding {
  return require('./index.linux-arm64-gnu.node');
}

/**
 * Load native bindings for Linux ARM64 (musl)
 */
export function loadLinuxArm64Musl(): RfdBinding {
  return require('./index.linux-arm64-musl.node');
}

/**
 * Load native bindings for Linux ARM (gnueabihf)
 */
export function loadLinuxArm(): RfdBinding {
  return require('./index.linux-arm-gnueabihf.node');
}

/**
 * Load native bindings for FreeBSD x64
 */
export function loadFreebsdX64(): RfdBinding {
  return require('./index.freebsd-x64.node');
}

/**
 * Load native bindings for Android ARM64
 */
export function loadAndroidArm64(): RfdBinding {
  return require('./index.android-arm64.node');
}

/**
 * Load native bindings for Android ARM
 */
export function loadAndroidArm(): RfdBinding {
  return require('./index.android-arm-eabi.node');
}

// Helper to detect if we're running on musl
function isMusl(): boolean {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      const { execSync } = require('child_process');
      const { readFileSync } = require('fs');
      const lddPath = execSync('which ldd').toString().trim();
      return readFileSync(lddPath, 'utf8').includes('musl');
    } catch (e) {
      return true;
    }
  } else {
    const { glibcVersionRuntime } = (process.report.getReport() as any).header;
    return !glibcVersionRuntime;
  }
}

// Automatically load the correct binding based on the current platform
let binding: RfdBinding;

switch (process.platform) {
  case 'darwin':
    switch (process.arch) {
      case 'arm64':
        binding = loadDarwinArm64();
        break;
      case 'x64':
        binding = loadDarwinX64();
        break;
      default:
        binding = loadDarwinUniversal();
        break;
    }
    break;
    
  case 'win32':
    switch (process.arch) {
      case 'x64':
        binding = loadWin32X64();
        break;
      case 'ia32':
        binding = loadWin32Ia32();
        break;
      case 'arm64':
        binding = loadWin32Arm64();
        break;
      default:
        throw new Error(`Unsupported architecture on Windows: ${process.arch}`);
    }
    break;
    
  case 'linux':
    switch (process.arch) {
      case 'x64':
        if (isMusl()) {
          binding = loadLinuxX64Musl();
        } else {
          binding = loadLinuxX64Gnu();
        }
        break;
      case 'arm64':
        if (isMusl()) {
          binding = loadLinuxArm64Musl();
        } else {
          binding = loadLinuxArm64Gnu();
        }
        break;
      case 'arm':
        binding = loadLinuxArm();
        break;
      default:
        throw new Error(`Unsupported architecture on Linux: ${process.arch}`);
    }
    break;
    
  case 'freebsd':
    if (process.arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${process.arch}`);
    }
    binding = loadFreebsdX64();
    break;
    
  case 'android':
    switch (process.arch) {
      case 'arm64':
        binding = loadAndroidArm64();
        break;
      case 'arm':
        binding = loadAndroidArm();
        break;
      default:
        throw new Error(`Unsupported architecture on Android: ${process.arch}`);
    }
    break;
    
  default:
    throw new Error(`Unsupported platform: ${process.platform}`);
}

// Export the automatically loaded binding
export const {
  AsyncFileDialog,
  AsyncMessageDialog,
  FileDialog,
  FileHandle,
  MessageButtons,
  MessageDialog,
  MessageLevel
} = binding;

// Also export the binding object itself
export default binding;

// Export all loader functions for manual selection if needed
export const loaders = {
  'darwin-arm64': loadDarwinArm64,
  'darwin-x64': loadDarwinX64,
  'darwin-universal': loadDarwinUniversal,
  'win32-x64': loadWin32X64,
  'win32-ia32': loadWin32Ia32,
  'win32-arm64': loadWin32Arm64,
  'linux-x64-gnu': loadLinuxX64Gnu,
  'linux-x64-musl': loadLinuxX64Musl,
  'linux-arm64-gnu': loadLinuxArm64Gnu,
  'linux-arm64-musl': loadLinuxArm64Musl,
  'linux-arm': loadLinuxArm,
  'freebsd-x64': loadFreebsdX64,
  'android-arm64': loadAndroidArm64,
  'android-arm': loadAndroidArm
} as const;