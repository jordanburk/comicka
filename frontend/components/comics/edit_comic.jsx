const React = require('react');
const hashHistory = require('react-router').hashHistory;

const FormInputs = require('./form_inputs');
const FormImages = require('./form_images');
const FormAddPages = require('./form_add_pages');

module.exports = React.createClass({

  // TODO: alert when navigate from page
  //       without saving changes
  //       when pages is not empty

  componentDidMount(){
    this.tokenA = ComicStore.addListener(this._onComicStoreChange);
  },

  componentWillUnmount(){
    this.tokenA.remove();
  },

  getInitialState(){
    return {
      thumb_url: "",
      title: "",
      shortname: "",
      updated: false
    };
  },

  _onComicStoreChange(){
    const comic = ComicStore.get(this.props.params.shortname);
    if(!SessionStore.isUserLoggedIn() || SessionStore.currentUser().id !== comic.creator_id){
      const url = `/${comic.shortname}`;
      hashHistory.push(url);
    }
    this.setState( comic );
  },

  onChange(e){
    this.setState({[e.target.id]: e.target.value});
  },

  imageChange(type, url){
    this.setState({[type]: url});
  },

  updateComic(e){
    // TODO: unbreak this even handler
    e.preventDefault();
    const comic = {
      title: this.state.title,
      shortname: this.state.shortname,
      thumb_url: this.state.thumb_url,
      id: this.state.id
    };
    ComicActions.updateComic(comic, this.updated);
  },

  updated(){
    setTimeout(this.clearUpdated, 1500);
    this.setState({updated: true});
  },

  clearUpdated(){
    this.setState({updated: false});
  },

  render(){
    return(
      this.state.thumb_url ?
        <article className="content">
          <div className="form-container">
            <FormInputs onChange={this.onChange}
                        doComic={this.updateComic}
                        comic={this.state}
                        buttonName="Update Comic" />
            <FormImages imageChange={this.imageChange}
                        comic={this.state} />
          </div>
          <FormAddPages addPage={this.addPage} comic={this.state} />
        </article> : <article className="content"></article>
    );
  }
});
