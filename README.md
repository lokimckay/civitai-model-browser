# Civitai Model Browser

[lokimckay.github.io/civitai-model-browser/](https://lokimckay.github.io/civitai-model-browser/)

Displays Civitai info for your locally downloaded models  
Runs in your browser, no data is uploaded

## Benefits

- Conveniently see trigger words for your downloaded models
- Don't need to rename downloaded files to be more descriptive anymore
- Find duplicates of downloaded models

## Roadmap

- [x] more info pages
- [x] deploy
- [x] cache hash
- [x] limit number of subworkers running at once
- [x] preview images
- [x] fuzzy search
- [x] share project
- [x] cycle preview images
- [x] grid view
- [x] hide error results
- [x] show more preview images on details page
- [ ] filter by base model
- [ ] sort by name/date downloaded
- [ ] Fuse feedback
- [ ] use dexie instead of localstorage (10MB limit in localstorage, indexeddb much larger)
- [ ] save to origin file system (for hashes & collections & notes)
- [ ] read hash from adjacent .sha256 file if it exists
- [ ] export hash files
- [ ] back to top button
- [ ] sticky search bar
- [ ] copy buttons
- [ ] expose model extensions as setting
- [ ] expose concurrent workers setting
- [ ] allow skipping of specific models
- [ ] export all origin file system data
- [ ] favorites/collections
- [ ] notes
