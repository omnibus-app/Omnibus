module.exports =
  findData: ( data ) ->
    result = data.actions.map (item) -> 
      x: Date.parse(new Date(item.datetime))
    result.sort (a, b) -> (a.x - b.x)
    result[i].y = i + 1 for i in [0..result.length - 1]
    result

