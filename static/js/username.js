function gotoBottom(id){
    var element = document.getElementById(id);
    element.scrollTop = element.scrollHeight - element.clientHeight;
}

function get_username() {
  /* default username to Untitled User */
  if (!localStorage.getItem("username")) {
    localStorage.setItem("username", "Untitled User");
  }
  // const username = localStorage.getItem("username");
  return localStorage.getItem("username");
}

function get_userid() {
  return localStorage.getItem("user-id");
}

function set_fields() {
  document.querySelector("#username-input").value = "";
  document.querySelector("#username").innerHTML = `Hi, ${get_username()}`;
}

function printSysMsg(msg, cls = "s-msg") {
  const li = document.createElement("li");
  const span = document.createElement("span");
  li.className += cls;
  span.innerHTML = msg;
  li.appendChild(span);
  document.querySelector("#sys-msg").append(li);
  gotoBottom('sys-msg')
}

function main() {
  var socket = io.connect(
    location.protocol + "//" + document.domain + ":" + location.port
  );

  socket.on("connect", () => {
    console.log("socket connect!");
    socket.emit("user-arrived-lobby", {
      username: get_username(),
      user_id: get_userid(),
    });
    set_fields();
  });

  // rename
  document.querySelector("#btn-sumbit-username").onclick = () => {
    const new_username = document.querySelector("#username-input").value;
    const previous_username = get_username();
    localStorage.setItem("username", new_username);
    set_fields();

    socket.emit("user-rename", {
      "new-username": new_username,
      "previous-username": previous_username,
      "user-id": get_userid(),
    });
  };

  socket.on("user-rename-bdc", (data) => {
    printSysMsg(data.msg);
  });

  document.querySelector("#btn-create-room").onclick = () => {
    const roomname = document.querySelector("#roomname-input").value;

    let roomnames = [];
    document.querySelectorAll("#room-list li a").forEach((rm) => {
      roomnames.push(rm.innerHTML);
    });

    if (roomnames.includes(roomname)) {
      alert(`${roomname} existes, choose another one`);
      document.querySelector("#roomname-input").value = "";
    } else if (roomname == "") {
      alert(`roomname must not be null`);
    } else {
      socket.emit("room-created", {
        "user-id": get_userid(),
        roomname: roomname,
      });
      document.querySelector("#roomname-input").value = "";
    }
  };

  socket.on("welcome-bdc", (data) => {
    printSysMsg(data.msg);
  });

  socket.on("store-user-id", (data) => {
    localStorage.setItem("user-id", data["sid"]);
    socket.emit("join", {
      "user-id": get_userid(),
      roomname: "lobby",
    });
  });

  window.onbeforeunload = () => {
    // close all room user created
    document.querySelectorAll("#room-list li a").forEach((room) => {
      let rm_owner_id = room.dataset.owner_id
      let rm_id = room.parentElement.id
      // console.log(rm_id)
      if (rm_owner_id == get_userid()){
        socket.emit('room-close', {'user-id': get_userid(), 'closed-room-id': rm_id})
      }
    })
    socket.emit("user-disconnect", { "user-id": get_userid() });
  };

  socket.on("disconnect-msg", (data) => {
    printSysMsg(data.msg);
  });

  function get_roomlist(roomname, owner_id) {
    console.log('get_roomlist() fire')
    
    const room = document.createElement("li");
    room.id = roomname
    
    
    const rm_name = document.createElement("a");
    rm_name.setAttribute("data-owner_id", owner_id);
    rm_name.setAttribute("href", "#");
    // rm_name.id = 'room-link'
    rm_name.innerHTML = roomname;
    
    rm_name.onclick =  () => {
      
      console.log(`${rm_name} clicked!!`)
      socket.emit("join", { "user-id": get_userid(), roomname: roomname, 'no-refresh-rmli': true });
      // socket.emit("join", { "user-id": get_userid(), roomname: roomname});
      
      document.querySelector("#sys-msg").innerHTML = "";
      
      rm_name.style.pointerEvents = "none";
      rm_name.style.color = "grey";
      
      const leave_btn = document.createElement("button");
      leave_btn.id = "leave-btn";
      leave_btn.setAttribute("data-roomname", roomname);
      leave_btn.innerHTML = "Leave";
      
      leave_btn.onclick = () => {
        socket.emit("leave", {"user-id": get_userid(),roomname: roomname,});
        
        rm_name.style.pointerEvents = "initial";
        rm_name.style.color = "#007bff";
        leave_btn.remove()
      }
      room.append(leave_btn);
    }
    room.append(rm_name);
    
    if (owner_id == get_userid()) {
      
      const del_btn = document.createElement("button");
      del_btn.id = "del-btn";
      del_btn.setAttribute("data-owner_id", owner_id);
      del_btn.innerHTML = `<span>Close ${roomname}</span>`;

      del_btn.onclick = function () {
        socket.emit("room-close", {
          "user-id": get_userid(),
          "closed-room-id": roomname,
        });
        this.remove()
      }
      
      // room.innerHTML += " ";
      room.append(del_btn);
    }

    document.querySelector("#room-list").append(room);
  }
  
  socket.on('get_roomlist', data => {
    
    p = document.createElement('p')
    p.id = 'room-list-heading'
    span = document.createElement('span')
    span.innerHTML = 'Rooms Available'
    p.append(span)

    document.querySelector("#room-list").innerHTML = "";
    document.querySelector("#room-list").append(p)
    

    for (let index = 0, l = data.room_list.length; index < l; index++) {
      const roomname = data.room_list[index][0];
      const owner_id = data.room_list[index][1];
      get_roomlist(roomname, owner_id)
    }
  })

  socket.on("room-created-bdc", (data) => {
    printSysMsg(data.msg);
    console.log('room-created-bdc fire')
    // socket.emit('join', {'user-id': get_userid(), 'roomname': data.roomname})
    get_roomlist(data.roomname, data["user-id"])


  });


  document.querySelector("#btn-send-msg").addEventListener("click", () => {
    const user_id = get_userid();
    const msg = document.querySelector("#msg-input").value;
    // console.log("msg send to backend!");
    if (msg != ''){
      socket.send({ "user-id": user_id, msg: msg });
      document.querySelector('#msg-input').value= ""
    }
    else{
      alert('no empty message.')
    }
  });

  document.querySelector('#msg-input').addEventListener('keydown', e =>{
    if(e.keyCode === 13 ){
      document.querySelector("#btn-send-msg").click()     
    }
  })

 
  socket.on("message", (data) => {
    printSysMsg(data.msg, "d-msg");
    document.querySelectorAll("#sys-msg .d-msg span span").forEach((msg) => {
      if (msg.dataset.sender_id == get_userid()) {
        msg.className = "my-msg";
      }
    });
  });


  function print_room(rm){
    const room = document.createElement('span')
    room.innerHTML = rm
    document.querySelector('#greet #room').innerHTML = 'You are now in '
    document.querySelector('#greet #room').append(room)
  }

  function get_roomlog(data){
    
    print_room(data.roomname)
    
    const request = new XMLHttpRequest();
    request.open("POST", "/room_log");
    const rmn = new FormData();
    rmn.append("room", data.roomname);
    request.send(rmn);
  
    request.onload = () => {
      const rmlog = JSON.parse(request.responseText);
        // console.log();
      if (rmlog.roomlog) {
        for (let index = 0, l = rmlog.roomlog.length; index < l; index++) {
          const element = rmlog.roomlog[index];
          printSysMsg(element, "d-msg");
        }
      }
    }
  }

  socket.on('get_roomlog', data =>{
    get_roomlog(data)
  })

  socket.on("join_room", data => {
    printSysMsg(data.msg);
  });

  socket.on("leave_room", (data) => {
    printSysMsg(data.msg);
  });

  socket.on("closed-room-cbdc", (data) => {
    printSysMsg(data.msg);
    socket.emit("leave", {
      "user-id": get_userid(),
      roomname: data["closed-room-id"],
    });
  });

  socket.on("closed-room-bdc", (data) => {
    printSysMsg(data.msg);
    console.log(data["closed-room-id"])
    document.getElementById(data["closed-room-id"]).remove();
  });

  socket.on("disconnect", () => {
    console.log("disconnect fire!");
    const msg = `${get_username()} is offline`;
    printSysMsg(msg);
  });
}

main();
