// frontend/src/jsMain/kotlin/view/BlogView.kt
package view

import controller.ApiClient
import kotlinx.browser.document
import kotlinx.html.js.div
import kotlinx.html.js.h2
import kotlinx.html.render
import model.Post

fun renderPostList(posts: List<Post>) {
    val container = document.getElementById("app")!!
    container.innerHTML = posts.joinToString("\n") { post ->
        kotlinx.html.dom.append {
            div {
                h2 { +"${post.title} (${post.date})" }
                // contentMarkdown is already HTML
                unsafe { +post.contentMarkdown }
            }
        }.outerHTML
    }
}

fun init() {
    ApiClient.fetchPosts { posts -> renderPostList(posts) }
}