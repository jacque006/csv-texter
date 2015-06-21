Grids = new Mongo.Collection("grid");

if (Meteor.isClient) {

  // Table
  Template.multiGrid.helpers({
    grids: function () { 
      var grids = Grids.find({}).fetch();
      grids.forEach(function(grid) {
        grid.data = createTableFromGrid(grid.data);
      });
      return grids;
    }
  });

  Template.multiGrid.events({
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
      readFile(f, function(name, content) {
        Meteor.call('upload', name, content);
      });
    }
  });

  readFile = function(f, onLoadCallback) {
    var reader = new FileReader();
    reader.onload = function (event){
      var content = event.target.result
      onLoadCallback(f.name, content);
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
    upload: function(name, content) {
      var grid = createGridFromCSV(content);
      Grids.insert({
        'name': name,
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
