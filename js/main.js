/* @flow */

"strict";

var React = require("react"),
    Util = require("./util"),
    models = require("./models"),
    APIClient = require("./apiclient"),
    Cache = require("./cache"),
    Downloads = require("./downloads"),
    Storage = require("./storage"),
    chromeViews = require("./views/chrome"),
    {Stack} = require("immutable"),
    {readOptions, resetOptions, writeOptions} = require("./data/app-options"),
    {readTopicTree} = require("./data/topic-tree"),
    Cursor = require('immutable/contrib/cursor');

// TODO: remove, just for easy inpsection
window.APIClient = APIClient;
window.Util = Util;
window.models = models;
window.React = React;

document.querySelector("body").addEventListener("contextmenu", function(e) {
    Util.log("contextmenu!");
    e.preventDefault();
});

// App is moving to background
document.addEventListener("visibilitychange", function(e) {
    if (document.hidden) {
        Util.log("visibility changing (hide)");
        // TODO(bbondy): Try to free up resources here for a smaller chance
        // of getting discarded.
    } else {
        Util.log("visibility changing (show)");
    }
});


var MainView = chromeViews.MainView;
var mountNode = document.getElementById("app");

// Render the main app chrome
var mainView = React.render(<MainView/>, mountNode);

// Init everything
Storage.init().then(function() {
    return APIClient.init();
}).then(function() {
    return models.TopicTree.init();
}).then(function() {
    return Promise.all([Downloads.init(), Cache.init()]);
}).then(function() {
    // We don't want to have to wait for results, so just start this and don't wait
    models.CurrentUser.init();

    readTopicTree().then((immutableTopicTree) => {
        var updateTopicTreeCursor = (newTopicTreeRoot) => {
            var topicTreeCursor = Cursor.from(immutableTopicTree, updateTopicTreeCursor);
            mainView.setProps({
                topicTreeRootCursor: topicTreeCursor,
                rootTopicTreeCursor: topicTreeCursor,
            });
            mainView.setState({
                topicTreeCursor: topicTreeCursor,
                navigationStack: Stack.of(topicTreeCursor),
            });
        };
        updateTopicTreeCursor(immutableTopicTree);
    });

    // Start showing the topic tree
    var options = readOptions() || resetOptions();
    var updateOptionsCursor = (newOptions) => {
        writeOptions(newOptions);
        mainView.setProps({ optionsCursor: Cursor.from(newOptions, updateOptionsCursor) });
    };
    var optionsCursor = Cursor.from(options, updateOptionsCursor);
    mainView.setProps({optionsCursor});
}).catch((error) => {
    alert(error);
    if (Util.isFirefoxOS()) {
        Util.quit();
    } else {
        throw error;
    }
});

