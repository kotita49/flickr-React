const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const PhotoStream = require('../models/PhotoStream')

exports.getData = (req, res) => {
  var request = new XMLHttpRequest()
  var description = []
  var title=[]
  var tags = []
  var url =
    'https://api.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1'
  request.open('GET', url, true)
  request.onload = function () {
    var response = JSON.parse(request.responseText).items

    response.forEach((e)=>{
title.push(e.title)
    })
    response.forEach((t)=>{
      tags.push(t.tags)
    })
    response.forEach((element) => {
      description.push(element.description)
    })
    var authorUrl = []
    description.forEach((d) => {
      authorUrl.push(d.substring(13, d.indexOf('/', 46)))
    })
    var name =[]
    description.forEach((n)=>{
      name.push((n.substring(n.indexOf('>', n.indexOf("people")), n.indexOf('<\/a> posted '))).substring(1))
    })
    var imgUrl = []
    description.forEach((i) => {
      imgUrl.push(
        i.substring(i.indexOf('https:', i.indexOf('title')),
          i.indexOf('" width='),
        ),
      )
    })
console.log(tags)
    var photoStream = new PhotoStream(imgUrl, authorUrl, name, title, tags )
    res.render('photoStream', {
      images: imgUrl,
      author: authorUrl,
      name: name,
      title: title, 
      tags: tags
    })
  }
  request.send()
}
