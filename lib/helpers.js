function groupUsers(users) {
  const groupedUsers = users.reduce((acc, user) => {
    const { content, first_name, email_address: email, is_complete, id } = user;
    if (!acc[user.email_address]) {
      const initialTodo = content ? [{ content, is_complete, id }] : [];
      acc[user.email_address] = { todos: initialTodo, user: first_name, email };
    } else {
      if (content) {
        acc[user.email_address].todos.push({ content, is_complete, id });
      }
    }
    return acc;
  }, {});
  return Object.values(groupedUsers);
}

function buildInsertString(data) {
  const fields = `(${Object.keys(data[0])})`;
  const values = data.reduce((acc, item, i) => {
    return (
      acc +
      "(" +
      Object.values(item).reduce((acc, val, i, list) => {
        if (typeof val === "string") val = `'${val}'`;
        return acc + `${val}` + (i < list.length - 1 ? "," : "");
      }, "") +
      ")" +
      (i < data.length - 1 ? "," : "")
    );
  }, "");
  return [fields, values];
}

const groupUserByPriority = (todosPerPriority) => {
  const labels = todosPerPriority.map((row) => row.email_address);
  const datasets = [
    {
      label: "Urgent",
      data: todosPerPriority.map((row) => row.urgent),
      backgroundColor: "rgba(255, 0, 0, 0.6)",
    },
    {
      label: "High Priority",
      data: todosPerPriority.map((row) => row.high_priority),
      backgroundColor: "rgba(255, 99, 132, 0.6)",
    },
    {
      label: "Medium Priority",
      data: todosPerPriority.map((row) => row.medium_priority),
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    },
    {
      label: "Low Priority",
      data: todosPerPriority.map((row) => row.low_priority),
      backgroundColor: "rgba(255, 206, 86, 0.6)",
    },
  ];
  return { labels, datasets };
};

const wrapTryCatch = (func, args = {}, defaultRes = {}) => {
  return async () => {
    try {
      const queryOutput = await func(args);
      return queryOutput;
    } catch (error) {
      console.log(`${func?.name} has encountered an error...${error.message}`);
      return defaultRes;
    }
  };
};

module.exports = { groupUsers, buildInsertString, groupUserByPriority, wrapTryCatch };
