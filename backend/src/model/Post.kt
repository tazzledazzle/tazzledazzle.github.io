import kotlinx.serialization.Serializable


@Serializable
data class Post(
    val id: String,
    val title: String,
    val date: String,
    val contentMarkdown: String
)