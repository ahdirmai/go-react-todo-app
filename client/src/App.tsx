import useSWR from "swr";
import { Button, Box, List, ThemeIcon } from "@mantine/core";
import AddTodo from "./components/AddTodo";
import { CheckCircleFillIcon } from "@primer/octicons-react";

export const ENDPOINT = "http://localhost:4000";

export interface Todo {
  id: number;
  title: string;
  body: string;
  done: boolean;
}

const fetcher = (url: string) =>
  fetch(`${ENDPOINT}/${url}`).then((r) => r.json());

function App() {
  const { data, mutate } = useSWR<Todo[]>("api/todos", fetcher);

  async function markTodoAsDone(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
      method: "PATCH",
    }).then((r) => r.json());

    mutate(updated);
  }

  async function deleteTodo(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}`, {
      method: "DELETE",
    }).then((r) => r.json());

    mutate(updated);
  }

  // async function editTodo(id: number) {
  //   const updated = await fetch(`${ENDPOINT}/api/todos/${id}/edit`, {
  //     method: "GET",
  //   }).then((r) => r.json());

  //   mutate(updated);
  // }

  return (
    <Box
      sx={(theme) => ({
        padding: "2rem",
        width: "100%",
        maxWidth: "40rem",
        margin: "0 auto",
      })}
    >
      <List spacing="xs" size="sm" mb={12} center>
        {data?.map((todo) => {
          return (
            <List.Item
              onClick={() => markTodoAsDone(todo.id)}
              key={`todo_list_${todo.id}`}
              icon={
                todo.done ? (
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <CheckCircleFillIcon size={20} />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon color="gray" size={24} radius="xl">
                    <CheckCircleFillIcon />
                  </ThemeIcon>
                )
              }
            >
              {todo.title}
              <Button onClick={() => deleteTodo(todo.id)}>Delete</Button>
              {/* <Button onClick={() => editTodo(todo.id)}>Edit</Button> */}
            </List.Item>
          );
        })}
      </List>

      {/* {JSON.stringify(data)} */}
      <AddTodo mutate={mutate} />
    </Box>
  );
}

export default App;
