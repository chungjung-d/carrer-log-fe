{
  description = "Ziggle Groups Environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs";

  outputs = { self, nixpkgs }: 
  let
    pkgs = import nixpkgs { system = "aarch64-darwin"; };
    nodejs = pkgs.nodejs_20;
    pnpm = pkgs.nodePackages.pnpm;
  in {
    devShells.aarch64-darwin.default = pkgs.mkShell {
      buildInputs = [
        nodejs
        pnpm
      ];
      
      shellHook = ''
        echo "Carrer Log Environment"
        echo "Node.js $(${nodejs}/bin/node --version) with pnpm $(${pnpm}/bin/pnpm --version) 환경으로 진입했습니다."
      '';
    };
  };
}

