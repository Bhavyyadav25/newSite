package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	// Create file server for static assets
	fs := http.FileServer(http.Dir("./frontend"))

	// Configure routes
	http.Handle("/css/", fs)
	http.Handle("/js/", fs)
	http.Handle("/images/", fs)

	// Handle HTML pages with client-side routing fallback
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Clean(r.URL.Path)
		ext := filepath.Ext(path)

		// Serve static files directly
		if ext != "" && ext != ".html" {
			fs.ServeHTTP(w, r)
			return
		}

		// Map clean URLs to HTML files
		htmlPath := filepath.Join("./frontend", path)
		if path == "/" {
			htmlPath = "./frontend/index.html"
		} else {
			htmlPath += ".html"
		}

		// Check if HTML file exists
		if _, err := os.Stat(htmlPath); err == nil {
			http.ServeFile(w, r, htmlPath)
			return
		}

		// Fallback to index.html for client-side routing
		http.ServeFile(w, r, "./frontend/index.html")
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server running on http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}