var RF = {};
RF.robots = [];

RF.Robot = function (name, metal, image) {
    this.name = name;
    this.metal = metal;
    this.image = image;
};
RF.Robot.prototype.isEditing = false;

RF.addRobot = function () {
    var name = document.getElementById('name');
    var metal = document.getElementById('metal');
    var image = document.getElementById('image');

    var robot = new RF.Robot(name.value, metal.value, image.value);
    RF.robots.push(robot);
    name.value = '';
    metal.value = '';
    image.value = '';

    RF.drawTable();
    RF.create(robot);
};

RF.willSortNormal = true;

RF.drawTable = function () {
    RF.robots.sort(RF.sortName);

    if (!RF.willSortNormal) {
        RF.robots.reverse();
    }


    var h = "<div class='container'><div class='row'>"
    for (var i in RF.robots) {
        h += "<div class='col-md-4'>";
        if (RF.robots[i].isEditing === true) {
            h += '<input type="text" id="eName" value="' + RF.robots[i].name + '"/>'
            h += '<input type="text" id="eMetal" value="' + RF.robots[i].metal + '" />'
            h += '<input type="text" id="eImage" value="' + RF.robots[i].image + '" />'
            h += "<div class='btn btn-success btn-sm btn-block center-block' onclick='RF.saveRobot(" + i + ")'>Save Robot</div>"
        } else {
            h += "<h1>" + RF.robots[i].name + "</h1>";
            h += "<h2>" + RF.robots[i].metal + "</h2>";
            h += "<div><img src='" + RF.robots[i].image + "' class='img-thumbnail img-responsive' style='height: 200px; width: 300px;'/></div>";
            h += "<div class='btn btn-warning btn-sm btn-block center-block' onclick='RF.editRobot(" + i + ")'>Edit</div>"
            h += "<div class='btn btn-danger btn-sm btn-block center-block' onclick='RF.destroyRobot(" + i + ")'>Destroy</div>"
        }
        h += "</div>"
    }


    h += "</div></div>"

    document.getElementById('table').innerHTML = h;
};
RF.create = function (robot) {

    var request = new XMLHttpRequest();
    request.open("POST", "https://robotxfactory.firebaseio.com/.json");
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.response);
            robot.key = data.name;
        }
        else {
            console.log("Error on: " + request.status);
        }

    };
    request.onerror = function () {
        console.log("Communication error!");
    };
    request.send(JSON.stringify(robot));
};
RF.getRobot = function () {
    var request = new XMLHttpRequest();
    request.open("GET", "https://robotxfactory.firebaseio.com/.json");
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.response);
            console.log(data);
            RF.robots = [];
            for (var i in data) {
                var robot = data[i];
                robot.key = i;
                robot.__proto__ = RF.Robot.prototype;
                RF.robots.push(robot);

            }
            RF.drawTable();
        } else {
            console.log("error");
        }
    }
    request.onerror = function () {
        console.log("errror on communication");
    }
    request.send();
}
RF.getRobot();

RF.editRobot = function (i) {
    RF.robots[i].isEditing = true;
    RF.drawTable();

};
RF.saveRobot = function (i) {
    delete RF.robots[i].isEditing;
    var name = document.getElementById("eName").value;
    var metal = document.getElementById("eMetal").value;
    var image = document.getElementById("eImage").value;
    var robot = new RF.Robot(name, metal, image);
    var request = new XMLHttpRequest();
    request.open("PATCH", "https://robotxfactory.firebaseio.com/" + RF.robots[i].key + ".json");
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            console.log("patch success");
            RF.getRobot();
        }
        else {
            console.log("Error on: " + request.status);
        }

    };
    request.onerror = function () {
        console.log("Communication error!");
    };
    request.send(JSON.stringify(robot));
};

RF.destroyRobot = function (index) {
    var key = RF.robots[index].key;
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "https://robotxfactory.firebaseio.com/" + key + "/.json");
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            RF.robots.splice(index, 1);
            RF.drawTable();
        }

    }
    xhr.send();

}

RF.sortName = function (a, b) {
    var a1 = a.name.toLowerCase();
    var b1 = b.name.toLowerCase();

    if (a1 > b1) {
        return 1;
    }
    else if (a1 < b1) {
        return -1;
    }
    return 0;
}