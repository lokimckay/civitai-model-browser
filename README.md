# Civitai Model Browser

🚧 Currently under development

## Explorer Flow

1. User supplies model directory (tabbed)
1. User clicks "load" button
1. Tool reads directory and hahes all files into local storage
1. Tool queries [/models-versions/by-hash/:hash](https://wiki.civitai.com/wiki/Civitai_API#GET_/api/v1/models-versions/by-hash/:hash)
1. Tool saves returned data to local storage
1. Tool displays relevant data

## Roadmap

- [x] more info pages
- [x] deploy
- [ ] images
- [ ] fuzzy search
- [ ] copy buttons
- [ ] grid view
