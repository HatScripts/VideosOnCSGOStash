// ==UserScript==
// @name         Videos on CS:GO Stash
// @namespace    http://hatscripts.com/
// @version      1.0
// @description  Adds videos from CS:GO Skin Showcase (youtube.com/ffffinal) to CS:GO Stash (csgostash.com)
// @author       HatScripts
// @include      http://csgostash.com/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @grant        GM_addStyle
// @noframes
// ==/UserScript==

$(function () {
    $.searchVideos = function (query, maxVideos) {
        return $.getJSON("https://www.googleapis.com/youtube/v3/search", {
            key:        "AIzaSyBba67Fu_vuKllOeKXC4v4L4-7GXD93TTs",
            part:       "snippet",
            channelId:  "UCBdaeqYDYlS4mxgiemhjRAw",
            type:       "video",
            fields:     "items(id/videoId,snippet/title)",
            q:          query,
            maxResults: maxVideos
        });
    };

    $.addVideoLinks = function (searchResults) {
        resultBoxes.each(function () {
            var resultBox = $(this);
            var skinName = resultBox.find("h3:first").text();
            var target = weapon + " | " + skinName;
            searchResults.items.forEach(function (video) {
                if (video.snippet.title.substr(0, target.length) === target) {
                    $.addVideoLink(resultBox, video.id.videoId);
                }
            });
        });
    };

    $.addVideoLink = function (resultBox, videoId) {
        resultBox.find(".skinLink").append(
            $("<p>").append(
                $("<a>", {
                    href:   "https://www.youtube.com/watch?v=" + videoId,
                    target: "_blank"
                }).click(function (e) {
                    var a = $(this);
                    a.css("display", "none");
                    $.embedVideoIn(a.parent(), videoId);
                    e.preventDefault();
                }).append(
                    $("<span>")
                        .addClass("glyphicon")
                        .addClass("glyphicon-film")
                ).append("Load Skin Showcase Video")
            )
        );
    };

    $.embedVideoIn = function (element, videoId) {
        element.append(
            $("<iframe>", {
                src:             "https://www.youtube.com/embed/" + videoId,
                width:           328,
                height:          185,
                frameborder:     0,
                allowfullscreen: ""
            })
        );
    };

    var heading = $("h1:first").text();
    var weapon = heading.substr(0, heading.indexOf(" Skins"));
    var resultBoxes = $(".resultBox");
    $.searchVideos(weapon, resultBoxes.length + 5).success($.addVideoLinks);
});