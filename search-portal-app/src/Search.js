import React, { Component } from "react";
import FontAwesome from 'react-fontawesome';
const InnerHTML = require('dangerously-set-inner-html')
const results = [];

export default class Search extends Component {

  constructor(props) {
    super(props);

    // the variables that will be used throughout the instance
    this.state = {
    	value: '', 
    	results: [],
    	numDocs: '',
      timeDocs: '',
      result_message: '',
    };

    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  displayNoResults() {
    
  }


  handleChange(event) {
    this.setState({value: event.target.value});
  }


  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
    var URL = "http://192.168.1.65:32338/solr/elgg-core/select?df=text_en&hl.fl=text_en,%20text_fr&hl.simple.post=%3C/em%3E&hl.simple.pre=%3Cem%3E&hl=on&q=" + this.state.value;
    //var URL = "http://192.168.1.18:8983/solr/elgg-core/select?df=text_en&hl.fl=text_en,%20text_fr&hl.simple.post=%3C/em%3E&hl.simple.pre=%3Cem%3E&hl=on&q=" + this.state.value;
    console.log(URL);
    fetch(URL, {
      headers: {"Accept": "application/json"},
      method: "GET"
    
    }).then(response => {

        return response.json()
     
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


      if (jsonResponse.numFound == 0) {
        this.setState({result_message: 'No results found'});
      }


      var arrDocs = [];

      for (var x in jsonDocs) {
      
      	console.log("x: " + x + " jsonDocs: " + jsonDocs[x]);
      	console.log("info: " + jsonDocs[x].name_en);
        var guid = jsonDocs[x].guid;
      	console.log("what " + guid);
        var highlightGUID = jsonResponseHighlight[guid];
        console.log("info: " + highlightGUID.text_en);

      	var arr1 = [];
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

      <div id="searchPage" class="parent">
      
      {/* the forum will call this.handleSubmit() function once the submit button has been pressed */}
      
      <form class="searchForm" onSubmit={this.handleSubmit}>
      <div class="searchBar">
        <input class="searchInput" name="searchText" value={this.state.value} onChange={this.handleChange} type="text"/>
        <button class="searchButton" type="submit"><FontAwesome name='search' size='lg' /></button>
        </div>
      </form>
    
      <div class="resultsInformation">{ this.state.numDocs ? "About " + this.state.numDocs + " results ( " + this.state.timeDocs + " milliseconds to query)" : "" }</div>
      
      <div class="resultsInformation">
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
      				
      					<div key='{idx}' class="searchResult"> 
      						<h3 class="searchResultTitle"><a href="{obj.url}">{obj.title_en}{obj.name_en}</a></h3>
      						<div class="searchResultCite"><cite class="searchResultURL">{obj.url}</cite></div>

      						<span class="searchResultDescription">
                    <div dangerouslySetInnerHTML={{__html: obj.highlight_en}} />
                  </span>

                  <div class="searchResultAdditionalInfo"> <strong>platform</strong> {obj.platform} | <strong>access</strong> {obj.access_id} | <strong>type</strong> {obj.type} | <strong>subtype</strong> {obj.subtype}</div>
      					</div>
      					
      					);
      				})      					
      				return <div>{result_array}</div>
      			})
          }

      	</div>
      </div>

    );
  }
  
}

