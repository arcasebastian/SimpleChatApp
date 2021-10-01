const axios = require("axios");
const test_message = { name: "TEST", text: "Testing Msj" };

describe("calc", () => {
  it("Should multiply 2 by 2", () => {
    expect(2 * 2).toBe(4);
  });
});

describe("get_messages", () => {
  it("Should return 200 request", (done) => {
    axios.get("http://localhost:3000/messages").then((data) => {
      expect(data.status).toBe(200);
      done();
    });
  });
  it("Should return a list not empty", (done) => {
    axios.get("http://localhost:3000/messages").then((data) => {
      expect(data.data.length).toBeGreaterThan(0);
      done();
    });
  });
});

describe("post_messages", () => {
  it("Should post a new message", (done) => {
    axios
      .post("http://localhost:3000/messages", test_message)
      .then((data) => {
        return axios.get("http://localhost:3000/messages");
      })
      .then((data) => {
        expect(data.status).toBe(200);
        const arrayData = data.data;
        expect(
          arrayData.find((el) => {
            return (
              el.name === test_message.name && el.text === test_message.text
            );
          }).name
        ).toBe(test_message.name);
        done();
      });
  });
});

describe("delete_message", () => {
  it("Should delete a message", (done) => {
    axios
      .get("http://localhost:3000/messages")
      .then((response) => {
        const idToDelete = response.data.find((el) => {
          return el.name === test_message.name && el.text === test_message.text;
        })._id;
        return axios.delete("http://localhost:3000/messages", {data: {_id: idToDelete}});
      })
      .then((data) => {
        expect(data.status).toBe(200);
        done();
      });
  });
});
