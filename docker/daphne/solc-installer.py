from solcx import install_solc
import solcx

print('Installating solcx compiler ! ')
install_solc(version='0.8.25')
print(solcx.get_installed_solc_versions())
print(solcx.get_compilable_solc_versions())
print('Installation successful !')
