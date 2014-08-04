<?php 
ob_start();
header('Access-Control-Allow-Origin: *');

$valid_exts = array('jpeg', 'jpg', 'png', 'gif');
$max_file_size = 20000 * 1024; #200kb
$nw = $nh = 1000; # image with & height
//print_r($_FILES['image']);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if ( isset($_FILES['image']) ) {
    if (! $_FILES['image']['error'] && $_FILES['image']['size'] < $max_file_size) {
      # get file extension
      list($type,$ext)  = explode('/',$_FILES['image']['type']); 
      $ext = strtolower($ext);
//echo $ext;
      # file type validity
      if (in_array($ext, $valid_exts)) {
          $path = 'uploads/' . uniqid()  . '.' . $ext;
          $size = getimagesize($_FILES['image']['tmp_name']);
          # grab data form post request
          $x = (int) $_POST['x'];
          $y = (int) $_POST['y'];
          $w = (int) $_POST['w'] ? $_POST['w'] : $size[0];
          $h = (int) $_POST['h'] ? $_POST['h'] : $size[1];
          # read image binary data
          $data = file_get_contents($_FILES['image']['tmp_name']);
          # create v image form binary data
          $vImg = imagecreatefromstring($data);
          $dstImg = imagecreatetruecolor($w, $h);
          # copy image
          imagecopyresampled($dstImg, $vImg, 0, 0, $x, $y, $w, $h, $w, $h);
          # save image
          imagepng($dstImg, NULL);

          # clean memory
          imagedestroy($dstImg);
           $i = ob_get_clean();
                    // Read image path, convert to base64 encoding
$imageData = base64_encode($i);

// Format the image SRC:  data:{mime};base64,{data};
$src = 'data:image/png;base64,'.$imageData;
echo $src;
          
        } else {
          echo 'unknown problem!';
        } 
    } else {
      echo 'file is too small or large';
    }
  } else {
    echo 'file not set';
  }
} else {
  echo 'bad request!';
}
?>