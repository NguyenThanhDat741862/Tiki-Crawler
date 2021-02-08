reset: 
	rm ./tmp/* || \
	rm ./data/categoryURL/* || \
	rm ./data/productID/* || \
	rm ./data/product/output/* || \
	rm ./data/product/error/* || \
	rm ./data/review/output/* || \
	rm ./data/review/error/*

run:
	docker run -v ${PWD}/data:/app/data 