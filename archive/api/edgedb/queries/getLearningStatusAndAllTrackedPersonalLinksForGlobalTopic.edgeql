with topicName := <str>$topicName,
     hankoId := <str>$hankoId
select User {
  learningStatus := "to_learn" if topicName in .topicsToLearn.name
  else "learning" if topicName in .topicsLearning.name
  else "learned" if topicName in .topicsLearned.name
  else "none",
  personalLinkIdsBookmarked := (
    select User.linksBookmarked
    filter .mainTopic.name = topicName
  ).id,
  personalLinkIdsInProgress := (
    select User.linksInProgress
    filter .mainTopic.name = topicName
  ).id,
  personalLinkIdsCompleted := (
    select User.linksCompleted
    filter .mainTopic.name = topicName
  ).id,
  personalLinkIdsLiked := (
    select User.linksLiked
    filter .mainTopic.name = topicName
  ).id
}
filter .hankoId = hankoId
