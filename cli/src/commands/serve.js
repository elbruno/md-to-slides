import { Command } from 'commander';

export const serveCommand = new Command()
  .name('serve')
  .description('Serve slides locally for development')
  .argument('[file]', 'HTML file to serve')
  .option('-p, --port <port>', 'Port to serve on', '3000')
  .action(async (file, options) => {
    console.log('serve command (not yet implemented by Livingston)');
  });
