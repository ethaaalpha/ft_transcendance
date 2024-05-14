# About ThreeJS 

THREEJS_ARCHIVE="r162.tar.gz"
THREEJS_URL="https://github.com/mrdoob/three.js/archive/refs/tags/r162.tar.gz"
THREEJS_DIR="three"

if [ ! -d "/usr/share/libs/$THREEJS_DIR" ]; then
    echo "Downloading threejs"
    wget "$THREEJS_URL" -O "$THREEJS_ARCHIVE"
    tar -xvzf "$THREEJS_ARCHIVE"
    mv "three.js-r162/" "$THREEJS_DIR"
    mv "$THREEJS_DIR" /usr/share/libs/
else
    echo "Threejs archive already exists. Skipping download."
fi		

# About the profile picture
echo "Copying default profil picture !"
cp -rf default /usr/share/media/

echo "Running nginx"
nginx -g "daemon off;" >/dev/null