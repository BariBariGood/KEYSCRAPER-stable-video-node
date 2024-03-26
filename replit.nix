{ pkgs }: {
	deps = [
		pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
    pkgs.ffmpeg
		pkgs.chromium
    pkgs.iproute2
    pkgs.mkinitcpio-nfs-utils
    pkgs.bashInteractive
    pkgs.nodePackages.bash-language-server
    pkgs.man
    pkgs.texlive.combined.scheme-basic
	];
}