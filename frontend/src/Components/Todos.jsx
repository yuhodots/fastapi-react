import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";

const TodosContext = React.createContext({
  todos: [],
  fetchTodos: () => {},
});

function AddTodo() {
  const [item, setItem] = React.useState("");
  const { todos, fetchTodos } = React.useContext(TodosContext);

  const handleInput = (event) => {
    setItem(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const newTodo = {
      id: todos.length + 1,
      item: item,
    };

    try {
      await axios.post("http://localhost:8000/todo", newTodo);
      fetchTodos(); // Refresh todos list
    } catch (error) {
      console.error("There was an error: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="text"
          placeholder="Add a todo item"
          aria-label="Add a todo item"
          onChange={handleInput}
        />
      </InputGroup>
    </form>
  );
}

function UpdateTodo({ item, id }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [todo, setTodo] = useState(item);
  const { fetchTodos } = React.useContext(TodosContext);

  const updateTodo = async () => {
    try {
      await axios.put(`http://localhost:8000/todo/${id}`, { item: todo });
      onClose(); // Close modal after update
      fetchTodos(); // Refresh todos list
    } catch (error) {
      console.error("There was an error updating the todo", error);
    }
  };

  return (
    <>
      <Button h="1.5rem" size="sm" onClick={onOpen}>
        Update Todo
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type="text"
                placeholder="Add a todo item"
                aria-label="Add a todo item"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
              />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button h="1.5rem" size="sm" onClick={updateTodo}>
              Update Todo
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function DeleteTodo({ id }) {
  const { fetchTodos } = React.useContext(TodosContext);

  const deleteTodo = async () => {
    try {
      await axios.delete(`http://localhost:8000/todo/${id}`);
      fetchTodos(); // Refresh todos list
    } catch (error) {
      console.error("There was an error deleting the todo", error);
    }
  };

  return (
    <Button h="1.5rem" size="sm" onClick={deleteTodo}>
      Delete Todo
    </Button>
  );
}

function TodoHelper({ item, id, fetchTodos }) {
  return (
    <Box p={1} shadow="sm">
      <Flex justify="space-between">
        <Text mt={4} as="div">
          {item}
          <Flex align="end">
            <UpdateTodo item={item} id={id} fetchTodos={fetchTodos} />
            <DeleteTodo id={id} fetchTodos={fetchTodos} />
          </Flex>
        </Text>
      </Flex>
    </Box>
  );
}

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/todo");
      setTodos(response.data.data); // Assuming the response has a data object
    } catch (error) {
      console.error("There was an error fetching the todos", error);
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <TodosContext.Provider value={{ todos, fetchTodos }}>
      <AddTodo />
      <Stack spacing={5}>
        {todos.map((todo) => (
          <TodoHelper item={todo.item} id={todo.id} fetchTodos={fetchTodos} />
        ))}
      </Stack>
    </TodosContext.Provider>
  );
}
