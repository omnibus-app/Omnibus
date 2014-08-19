buildData = (json, i) ->
  temp = {}
  temp.number = json.number
  temp.repY = +json.vote.republican.yes
  temp.repN = +json.vote.republican.no
  temp.repAbs = +json.vote.republican.not_voting
  temp.demY = +json.vote.democratic.yes
  temp.demN = +json.vote.democratic.no
  temp.demAbs = +json.vote.democratic.not_voting
  temp.amdt = json.amendment_id
  temp.bill = json.bill_id
  temp

module.exports =
  buildData: buildData
