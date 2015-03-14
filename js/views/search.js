/* @flow */

"use strict";

var $ = require("jquery"),
    React = require("react/addons"),
    l10n = require("../l10n"),
    topicViews = require("./topic");

var ContentListViewer = topicViews.ContentListViewer;

/**
 * Represents the topic search input item which is right below the header.
 */
class TopicSearch extends React.Component {
    getInitialState() {
        return {
            searchValue: ""
        };
    }
    onChange(event: any) {
        var topicSearch = event.target.value;
        this.setState({
            searchValue: topicSearch
        });
        this.props.onTopicSearch(topicSearch);
    }
    handleFocus(event: any) {
        setTimeout(() => {
            $("html, body").stop(true, true).animate({
                scrollTop: $(this.refs.search.getDOMNode()).offset().top
            }, 500);
        }, 500);
    }
    handleBlur(event: any) {
        $("html, body").stop(true, true).animate({
            scrollTop: 0
        }, 700);
    }

    render(): any {
        var text = l10n.get("search");
        if (this.props.model.getTitle()) {
            text = l10n.get("search-topic", {
                topic: this.props.model.getTitle()
            });
        }
        return <div>
            <input ref="search"
                   className="search app-chrome"
                   type="searh"
                   placeholder={text}
                   value={this.state.searchValue}
                   required=""
                   onChange={this.onChange}
                   onFocus={this.handleFocus}
                   onBlur={this.handleBlur}
                   />
        </div>;

    }
}
TopicSearch.propTypes = {
    model: React.PropTypes.object.isRequired,
    onTopicSearch: React.PropTypes.func.isRequired
};

/**
 * Represents a search result list which is basically just a wrapper around a
 * ContentListViewer for now.
 */
class SearchResultsViewer extends React.Component {
    render(): any {
        var control = <ContentListViewer collection={this.props.collection}
                                         onClickContentItem={this.props.onClickContentItem} />;
        return <div className="topic-list-container">
            {control}
        </div>;
    }
}
SearchResultsViewer.propTypes = {
    collection: React.PropTypes.object.isRequired,
    onClickContentItem: React.PropTypes.func.isRequired
};

module.exports = {
    TopicSearch,
    SearchResultsViewer,
};
