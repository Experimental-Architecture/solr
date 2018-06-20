import React, { Component } from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SearchBar from 'material-ui-search-bar';

export default class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
    	value: '', 
    	results: [],
    	numDocs: '',
      timeDocs: '',
      result_message: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  onRequestSearch() {
    //192.168.1.65:32338/solr/elgg-core/select?df=text_en&hl.fl=text_en, text_fr&hl.simple.post=</em>&hl.simple.pre=<em>&hl=on&q=*:*
    var URL = "http://192.168.1.65:32338/solr/elgg-core/select?df=text_en&hl.fl=text_en, text_fr&hl.simple.post=</em>&hl.simple.pre=<em>&hl=on&q=" + this.state.value;
    console.log(URL);

    fetch(URL, {
      headers: {"Accept": "application/json"},
      method: "GET"

    }).then(response => {

      return response.json();

    }).then(response => {

      var jsonResponseHeader = response.responseHeader;
      var jsonResponse = response.response;
      var jsonNumFound = jsonResponse.numFound;
      var jsonStart = jsonResponse.start;
      var jsonDocs = jsonResponse.docs;
      var jsonResponseHighlight = response.highlighting;

      this.setState({numDocs: jsonNumFound});
      this.setState({timeDocs: jsonResponseHeader.QTime});
      console.log("number of documents " + jsonResponse.numFound);

      if (jsonResponse.numFound === 0) {
      this.setState({result_message: 'No results found'});
      }

      var arrDocs = [];
      for (var x in jsonDocs) {

        var guid = jsonDocs[x].guid;
        var highlightGUID = jsonResponseHighlight[guid];
        var arr1 = [{
          "id": x,
          "guid": jsonDocs[x].guid,
          "name_en": jsonDocs[x].name_en,
          "name_fr": jsonDocs[x].name_fr,
          "title_en": jsonDocs[x].title_en,
          "title_fr": jsonDocs[x].title_fr,
          "description_en": jsonDocs[x].description_en,
          "description_fr": jsonDocs[x].description_fr,
          "highlight_en": highlightGUID.text_en,
          "highlight_fr": highlightGUID.text_fr,
          "type": jsonDocs[x].type,
          "subtype": jsonDocs[x].subtype,
          "date_created": jsonDocs[x].date_created,
          "date_modified": jsonDocs[x].date_modified,
          "url": jsonDocs[x].url,
          "access_id": jsonDocs[x].access_id,
          "platform": jsonDocs[x].platform
        }];

        arrDocs.push(arr1);
      }

      this.setState({results: arrDocs});

    }).catch(function(error) {

      console.log("error: " + error);
      //this.setState({result_message: 'Error!'});

    });

  }


  render() {
 
    return (

      <MuiThemeProvider>
      <div id="searchPage" className="parent">  
        <SearchBar
          onChange={(query) => {this.setState({value:query})}}
          onRequestSearch={this.onRequestSearch.bind(this)}
          style={{ margin: '0 auto', fullWidth: 'true' }}
          value={this.state.value}
        />

      <div className="resultsInformation">{ this.state.numDocs ? "About " + this.state.numDocs + " results ( " + this.state.timeDocs + " milliseconds to query)" : "" }</div>
      
      <div className="resultsInformation">
      {
        this.state.result_message
      }
      </div>

      	<div>
      		{
      			this.state.results.map((name, index) => {
      				var subName = name;
      				var result_array = [];
      				subName.map((obj, idx) => {
      					result_array.push(
      				
      					<div className="searchResult"> 
      						<h3 className="searchResultTitle"><a href={obj.url}>{obj.title_en}{obj.name_en}</a></h3>
      						<div className="searchResultCite"><cite className="searchResultURL">{obj.url}</cite></div>

      						<span className="searchResultDescription">
                    <div dangerouslySetInnerHTML={{__html: obj.highlight_en}} />
                  </span>

                  <div className="searchResultAdditionalInfo"> <strong>platform</strong> {obj.platform} | <strong>access</strong> {obj.access_id} | <strong>type</strong> {obj.type} | <strong>subtype</strong> {obj.subtype}</div>
      					</div>
      					
      					);
      				})      					
      				return <div>{result_array}</div>
      			})
          }

      	</div>
      </div>

      </MuiThemeProvider>

    );
  }
  
}

