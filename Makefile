.PHONY: run build clean

run:
	@echo "Starting development server..."
	@go run server.go

build:
	@echo "Building frontend..."
	@mkdir -p dist/{css,js,images}
	@cp -r frontend/*.html frontend/css frontend/js frontend/images dist/

clean:
	@echo "Cleaning up..."
	@rm -rf dist