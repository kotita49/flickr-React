import React from 'react'
import './App.css'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faSearch } from '@fortawesome/free-solid-svg-icons'

function Search(props) {
  return (
    <div class="card">
      <img class="image" src={props.photo.media} alt={props.photo.title} />
      <div class="details">
        <h3 class="title">
          {' '}
          <a href={props.photo.link} target="_blank" rel="noreferrer">
            {props.photo.title}{' '}
          </a>
        </h3>
        <h3 class="author">
          {' '}
          by{' '}
          <a href={props.photo.author_link} target="_blank" rel="noreferrer">
            {props.photo.author}
          </a>
        </h3>
      </div>
      <div class="description">
        <p>
          {' '}
          Posted on: {props.photo.date} at {props.photo.time}.{' '}
        </p>
      </div>
      <div class="tags">
        <p>{props.photo.tags}</p>
      </div>
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: 20,
      pictures: [],
      page: 1,
      loading: false,
      search: null,
    }
  }

  componentDidMount = () => {
    this.fetchPage(this.state.page)
  }
  fetchData = (data) => {
    let pictures = data.photos.photo.map((pic) => {
      var title = pic.title
      var media =
        'https://farm' +
        pic.farm +
        '.staticflickr.com/' +
        pic.server +
        '/' +
        pic.id +
        '_' +
        pic.secret +
        '.jpg'
      var date = new Date(pic.datetaken).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      var time = new Date(pic.datetaken).toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
      var author = pic.ownername
      if (pic.tags === '') {
        var tags = ''
      } else {
        var tags_end = pic.tags.split(' ').join(', #')
        var tags_start = 'Tags: #'
        tags = tags_start + tags_end
      }
      var link =
        'https://www.flickr.com/photos/' + pic.owner + '/' + pic.id + '/'
      var author_link = 'https://www.flickr.com/photos/' + pic.owner + '/'

      pic = {
        title: title,
        media: media,
        date: date,
        time: time,
        author: author,
        tags: tags,
        link: link,
        author_link: author_link,
      }
      return pic
    })
    this.setState({
      pictures: [...this.state.pictures, ...pictures],
    })
    this.setState({
      loading: false,
    })
  }

  fetchPage = (pageNumber) => {
    let url =
      'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' +
      process.env.REACT_APP_API_KEY +
      '&format=json&page=' +
      pageNumber +
      '&lang?en&safe_search=1&tags=nature&extras=owner_name,url_s,url_m,url_l,date_taken,description,tags&nojsoncallback=1'
    this.setState({
      loading: true,
    })
    fetch(url)
      .then(function (response) {
        return response.json()
      })
      .then((data) => this.fetchData(data).bind(this))
      .catch((err) => {
        console.log(err)
      })
  }

  fetchSearchData = (pageNumber, searchQuery) => {
    this.setState({
      loading: true,
    })
    let url =
      'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' +
      process.env.REACT_APP_API_KEY +
      '&format=json&page=' +
      pageNumber +
      '&lang?en&safe_search=1&text=' +
      searchQuery +
      '&extras=owner_name,url_s,url_m,url_l,date_taken,description,tags&nojsoncallback=1'
    fetch(url)
      .then(function (response) {
        return response.json()
      })
      .then((data) => this.fetchData(data).bind(this))
      .catch((err) => {
        console.log(err)
      })
  }

  mySubmitHandler = (event) => {
    event.preventDefault()
    this.setState({ pictures: [], page: 1 })
    this.fetchSearchData(this.state.page, this.state.search)
    this.setState({ loading: true })
  }
  myChangeHandler = (event) => {
    this.setState({ search: event.target.value })
  }

  render() {
    return (
      <body id="home">
        <h1>Flickr</h1>
        <div id="top" class="search">
          <form onSubmit={this.mySubmitHandler}>
            <input
              class="form-search"
              type="search"
              placeholder="search"
              aria-label="Search"
              onChange={this.myChangeHandler}
            />
            <button class="btn-search" type="submit">
            <FontAwesomeIcon icon={faSearch}/>
            </button>
          </form>
        </div>
        <div>
          <InfiniteScroll
            dataLength={this.state.pictures.length}
            next={() => this.fetchPage(this.state.pageNumber + 1)}
            hasMore={true}
            loader={<p className="loading"> <FontAwesomeIcon icon={faCoffee}/></p>}
            endMessage={
              <p>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <div className="container">
              {this.state.pictures.map((photodata) => (
                <Search photo={photodata} />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </body>
    )
  }
}

export default App
