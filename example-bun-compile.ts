/**
 * Example of using rfd with Bun compile
 * 
 * This demonstrates how the static loader works with auto-detection
 */

// Import directly - platform detection happens automatically
import { FileDialog, MessageDialog, MessageLevel } from './index-static';

// Or import from the package with the /static export
// import { FileDialog, MessageDialog, MessageLevel } from '@xmorse/rfd/static';

// Example usage
export async function selectFile(): Promise<string | null> {
  const dialog = new FileDialog();
  dialog.setTitle('Select a file');
  dialog.addFilter('Images', '*.png,*.jpg,*.jpeg,*.gif');
  dialog.addFilter('All files', '*');
  
  const result = await dialog.pickFile();
  return result;
}

export async function showMessage(message: string): Promise<void> {
  const dialog = new MessageDialog();
  dialog.setTitle('Message');
  dialog.setDescription(message);
  dialog.setLevel(MessageLevel.Info);
  
  await dialog.show();
}

// When you build with Bun:
// bun build --compile example-bun-compile.ts
// 
// Bun will:
// 1. See all the static require() calls in index-static.ts
// 2. Tree-shake to only include the one for your platform
// 3. Bundle that .node file into the executable
//
// The resulting binary will work without external dependencies!