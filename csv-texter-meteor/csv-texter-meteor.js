Grids = new Mongo.Collection("grid");

if (Meteor.isClient) {

  // Table
  Template.gridTable.helpers({
    tableHtml: function () { 

    var grids = Grids.find({'id': 0}).fetch();
      if (grids && grids.length > 0 && grids[0] != null) {
        var grid = grids[0].data;
        return createTableFromGrid(grid);
      }

      return null;
    }
  });

  Template.gridTable.events({
    "click": function(event) {
      var id = event.target.id;
      if (id != null && id.length > 0) {
        var pair = id.split(',');
        var x = pair[0];
        var y = pair[1];

        // Only take clicks from top column.
        if (y < 1) {
          message = prompt("Enter a message to send to all numbers in this column");
          if (message != null) {
            Meteor.call('send', x, message);
          }
        }
      }
    }
  });

  // Upload
  Template.uploadButton.events({
    "click #upload": function(event) {
      var f = document.getElementById('fileInput').files[0];
      readFile(f, function(content) {
        Meteor.call('upload', content);
      });
    }
  });

  readFile = function(f, onLoadCallback) {
    var reader = new FileReader();
    reader.onload = function (event){
      var contents = event.target.result
      onLoadCallback(contents);
    }
    reader.readAsText(f);
  };

  // Clear
  Template.clearButton.events({
    "click #clear": function(event) {
      Meteor.call('clear');
    }
  });

  function createTableFromGrid(grid) {
    var table = '';

    // We can always assume a 2d matrix.
    for (var y = 0; y < grid[0].length; y++) {
      table += '<tr>';
      for (var x = 0; x < grid.length; x++) {
        // For grid coordinates.
        table += '<td id="' + x + ',' + y + '">';
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
    upload: function(csv) {
      var grid = createGridFromCSV(csv);
      Grids.insert({
        'id': 0,
        'data': grid
      });
    },
    send: function(column, message) {
        console.log(column + ", " + message);
    },
    clear: function() {
      Grids.remove({});
    }
  });


  function createGridFromCSV(csvStr) {
    csvStr += "";
    var grid = [];

    var rowsArray = csvStr.split("\r");
    for (var y = 0; y < rowsArray.length; y++) {
      var row = rowsArray[y];

      var columnArray = row.split(",");
      for (var x = 0; x < columnArray.length; x++) {
        if (grid[x] == null) {
          grid[x] = [];
        }

        grid[x][y] = columnArray[x];
        console.log(x + ',' + y + '=' + grid[x][y]);
      }
    }

    return grid;
  }
}
