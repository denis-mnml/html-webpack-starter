<?php

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$json = array();

		$name = clean($_POST["name"]);
		$phone = clean($_POST["phone"]);
		$email = clean($_POST["email"]);
		$message = clean($_POST["message"]);
		$utm = clean($_POST["utm"]);

		if(empty($name)) {
			$json['error']['name'] = 'Введите имя';
		}

		if(empty($phone)) {
			$json['error']['phone'] = 'Введите номер телефона';
		}

		if(empty($email)) {
			$json['error']['email'] = 'Введите email';
		}

		if(empty($json)) {
			$email_validate = filter_var($email, FILTER_VALIDATE_EMAIL);

			if(!$email_validate) {
				$json['error']['email'] = 'Неверный email';
			}

			if(check_length($phone, 2, 32)) {
					$json['error']['phone'] = 'Телефон должен содержать от 4 до 32 символов!';
			}

			if(check_length($name, 2, 32)) {
					$json['error']['name'] = 'Имя должно содержать от 2 до 32 символов!';
			}
		}

		if(empty($json)) {
			$to = 'denisminimal@yandex.ru';
			$subject = 'Стать партнером Maximagroup.by';

			$message = "<html><body>
										<table style='width: 100%; border-collapse: collapse;'>
							        <tr style='background-color: #f6f6f6'>
							          <td style='padding: 10px;'><b>Имя</b></td>
							          <td style='padding: 10px;'>$name</td>
							        </tr>
							        <tr>
							          <td style='padding: 10px;'><b>Телефон</b></td>
							          <td style='padding: 10px;'>$phone</td>
							        </tr>
							        <tr style='background-color: #f6f6f6'>
							          <td style='padding: 10px;'><b>E-mail</b></td>
							          <td style='padding: 10px;'>$email</td>
							        </tr>
							        <tr>
							          <td style='padding: 10px;'><b>Комментарий</b></td>
							          <td style='padding: 10px;'>$message</td>
							        </tr>";

			if($utm) {
				$message .= "<tr style='background-color: #f6f6f6'>
							          <td style='padding: 10px;'><b>Откуда пришел</b></td>
							          <td style='padding: 10px;'>$utm</td>
							        </tr>";
			}

			$message .= "</table></body></html>";
			
			$headers = "From: Maximagroup.by <noreply@maximagroup.by> \r\n";
			$headers .= "MIME-Version: 1.0 \r\n";
			$headers .= "Content-type: text/html; charset=utf-8 \r\n";
			// $headers[] = 'From: <noreply@maximagroup.by>';

			$success = mail($to, $subject, $message, $headers);


			if($success) {
				echo json_encode(array(
					'success' => 'OK'
				));
			} else {
				echo json_encode(array(
					'error' => 'error_send'
				));
			}

		} else {
			echo json_encode($json);
		}
	}

	function clean($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = strip_tags($data);
		$data = htmlspecialchars($data);

		return $data;
	}

	function check_length($value = "", $min, $max) {
    $result = (mb_strlen($value) < $min || mb_strlen($value) > $max);
    return $result;
	}