def error_response(message, status_code):
	return {
		'success': False,
		'error': {
			'message': message,
			'code': status_code
		}
	}, status_code

def success_response(data, status_code=200):
	return {
		'success': True,
		'data': data
	}, status_code