package main

// import all necessary dev
import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// Definisi setiap variable
type Todo struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
	Body  string `json:"body"`
}

// Function Main (wajib)
func main() {
	app := fiber.New()

	// Cors Setting
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://127.0.0.1:3000", // Sesuaikan dengan alamat frontend Anda
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Array Todo tempat menaruh data
	todos := []Todo{}

	// Metode Post untuk menambah data Todo dan disimpan ke array Todo
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}
		if err := c.BodyParser(todo); err != nil {
			return err
		}
		todo.ID = len(todos) + 1
		todos = append(todos, *todo)
		return c.JSON(todos)
	})

	// Merubah Todo menjadi Done
	app.Patch("/api/todos/:id/done", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")

		if err != nil {
			return c.Status(400).SendString("Invalid Id")
		}
		found := false
		for i, t := range todos {
			if t.ID == id {
				todos[i].Done = true
				found = true
				break
			}
		}

		if !found {
			return c.Status(404).SendString("Todo not found")
		}

		return c.JSON(todos)
	})

	// Get All Todo
	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.JSON(todos)
	})

	app.Delete("/api/todos/:id", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(400).SendString("Invalid ID")
		}

		index := -1
		for i, todo := range todos {
			if todo.ID == id {
				index = i
				break
			}
		}
		if index == -1 {
			return c.Status(404).SendString("Todo not found")
		}

		todos = append(todos[:index], todos[index+1:]...)

		return c.JSON(todos)
	})

	log.Fatal(app.Listen(":4000"))
}
