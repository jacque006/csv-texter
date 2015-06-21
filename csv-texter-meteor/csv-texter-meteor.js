Grids = new Mongo.Collection("grid");

if (Meteor.isClient) {

  Template.gridTable.helpers({
    tableHtml: function () {
      var grids = Grids.find({'id': 0}).fetch();
      if (grids && grids.length > 0 && grids[0] != null) {
        return createTableFromGrid(grids[0].data);
      }

      return null;
    }
  });

  Template.uploadButton.events({
    "click #upload" : function(e) {
      var f = document.getElementById('fileInput').files[0];
      readFile(f, function(content) {
        Meteor.call('upload',content);
      });
    }
  });

  readFile = function(f,onLoadCallback) {
    var reader = new FileReader();
    reader.onload = function (e){
      var contents = e.target.result
      onLoadCallback(contents);
    }
    reader.readAsText(f);
  };

  function createTableFromGrid(grid) {
    var table = "";

    for (var x = 0; x < grid.length; x++) {

      table += '<tr>';
      for (var y = 0; y < grid[x].length; y++) {
        table += '<td>';
        table += grid[x][y];
        table += '</td>';
      }
      table += '</tr>';
    }

    return table;
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {

  });

  return Meteor.methods({
    upload : function(csv) {
      var grid = createGridFromCSV(csv);
      Grids.insert({
        'id': 0,
        'data': grid
      });
    }
  });


  function createGridFromCSV(csvStr) {
    csvStr += "";
    console.log(csvStr);
    var grid = [];

    var columsArray = csvStr.split("\r");
    console.log("-----------");
    console.log(columsArray);
    for (var x = 0; x < columsArray.length; x++) {
      grid[x] = [];
      var column = columsArray[x];

      var rowsArray = column.split(",");
      console.log("-----------");
      console.log(rowsArray);
      for (var y = 0; y < rowsArray.length; y++) {
        grid[x][y] = rowsArray[y];
      }
    }

    return grid;
  }
}
