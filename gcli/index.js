#! /usr/bin/env node
'use strict'

const program = require('commander');

const glacier = require('glacier');


program
  .version('0.0.1')
  .command('create <req> [optional]')
  .description('command description')
  .option('-o, --option','we can still have addl options')
  .action(function(req,optional){
    
    console.log('{}')
      // const dataSource = glacier.createDataSource(req);
      // const model = glacier.createModel();
      // model.subscribe(dataSource);
      // dataSource.init();
      // const exporter = glacier.createVegaExporter();
      // const vegaSpec = exporter.export(model);
      // console.log(vegaSpec);
      
  });
program.parse(process.argv);
