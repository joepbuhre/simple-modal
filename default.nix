# { pkgs ? import <nixpkgs> {} }:
# let
# in
#   pkgs.mkShell {
#     buildInputs = [
#       pkgs.nodejs_20
#       pkgs.go
#       pkgs.air
#       pkgs.go-swag
#       pkgs.gopls
#     ];

#     # export GOPATH="/home/jbuhre/development/joepbuhre/snappic/backend/.gopath"
#     # export PATH="$PATH:/home/jbuhre/development/joepbuhre/snappic/backend/.gopath/bin"
#   shellHook = ''
#     export GOROOT="${pkgs.go}"
#   '';
# }

{ pkgs ? import <nixpkgs> { } }:

with pkgs;

mkShell {
  buildInputs = [
    nodejs_20
  ];
}
