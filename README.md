_This repository showcases work I did with a native application for OSX using Javascript. The application itself is no longer being actively developed or used_

# Percolate Demo Starter



## Motivation

This nw.js app starts a google app engine development server in python and runs a webpack watch on the Percolate demo repository on your local machine.  The motivation behind this app was to allow developers to not have to commit the build code for the demo to Github for PMs and other stakeholders to preview changes on a branch.  Stakeholders can use the app without having to pull down the build code.

## Test

To test the app:

- clone the respository
- run `npm install`
- download the nw package `npm install nw -g`
- run `nw` command on the directory with the `package.json`

## Build

To build the app:
- download the nwbuild package `npm install nwbuild -g`
- run `nwbuild -p [operating system]` where operating system is either `osx64` or `osx32`
- OSX application will be bundled and ready for use



## Compatibility

The current version only supports OSX operating system

Also, the demo repository currently has to exist in either `~/percolate/demo` or `~/demo` for the application to work correctly
