<?php 

	require_once $_SERVER['DOCUMENT_ROOT'].'/security/config.php';
	if (isset($_POST['submit'])){

		$user_username = htmlspecialchars($_POST['username']);
		$user_pwd = htmlspecialchars($_POST['password']);

		$errors = [];
		if (empty($user_username)) {
			$errors[] = "Le nom d'utilisateur est requis.";
		} 
		if (empty($user_pwd)) {
			$errors[] = "Le mot de passe est requis.";
		}
		if (empty($errors)) {
			$query=$db->prepare("SELECT * FROM users WHERE user_username = :username");
			$query->execute([":username"=>$user_username]);
			
			if($row=$query->fetch()){
				if(password_verify($user_pwd,$row['user_password'])){
					session_start();
					$_SESSION['user_username'] = $user_username;
					$_SESSION['logged_in'] = true;
					header('Location:dashboard.php');
				}else{
					$errors[] = "Email ou mot de passe invalide.";
				}
			}
		}
	}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="UTF-8">
	<title>LOGIN</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Work+Sans&display=swap" rel="stylesheet">
	<meta name="description" content="">
	<link rel="stylesheet" href="../assets/css/login.css">
	<!-- <script type="text/javascript" src="../assets/js/login.js" defer></script> -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<script src="../assets/js/popup.js"defer></script>
	<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</head>
<body>
<main>
	<div class="form-connexion">
		<h1>Connexion</h1>
		<form class="form-container" method="POST" action="login.php">
			<div class="box-form">
				<label for="username">Nom d'utilisateur</label>
				<input type="username" name="username" id="username" required>
			</div>
			<div class="box-form">
				<label for="mdp">Mot de passe</label>
				<input type="password" name="password" id="mdp" required>
			</div>
			<?php if (!empty($errors)){ ?>
				<div id="error-message">
					<ul>
						<?php foreach ($errors as $error): ?>
							<li><?php echo htmlspecialchars($error); ?></li>
						<?php endforeach; ?>
					</ul>
				</div>
            <?php }else{ ?>
				<?php }?>
			<div class="btn-container">
				<button type="submit" name="submit">Se connecter</button>
				<a href="#" class="hint-link" id="hintTrigger">Mot de passe oublié</a>
			</div>
		</form>
		<div class="popup" id="hintPopup">
        <div class="popup-content">
            <div class="popup-header">
                <h2>Indice pour l'Escape Game</h2>
                <span class="close-btn" id="closePopup">&times;</span>
            </div>
            <div class="popup-body">
                <p>Vous semblez bloqué ? Voici un indice qui pourrait vous aider :</p>
                <div class="hint-container">
                    <p>🔍  Avez-vous regarder autour de vous ?</p>
                </div>
                <button class="btn" id="closeHintBtn">J'ai compris</button>
            </div>
        </div>
    </div>
	</div>	
</main>
</body>
</html>