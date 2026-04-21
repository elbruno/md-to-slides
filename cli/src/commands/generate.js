import { Command } from 'commander';

export const generateCommand = new Command()
  .name('generate')
  .description('Generate slides from markdown')
  .argument('<input>', 'Input markdown file')
  .option('-o, --output <file>', 'Output HTML file')
  .action(async (input, options) => {
    console.log('generate command (not yet implemented by Livingston)');
  });
