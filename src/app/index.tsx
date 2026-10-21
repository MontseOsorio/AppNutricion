import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';

export default function App() {
  return (
    <View style={styles.container}>
        
      {/* Título */}
      <Text style={styles.titulo}>
        ¡Bienvenido a
        {'\n'}
        <Text style={styles.troya}>TroyaFit!</Text>
      </Text>

      {/* Eslogan */}
      <Text style={styles.subtitulo}>
        Nutrición inteligente para tu cuerpo y mente.
      </Text>

      {/* Troyano */}
      <Image
          source={require('../../assets/images/troyano.png')}
        style={styles.troyano}
        resizeMode="contain"
      />

      {/* Tarjeta */}
        <TouchableOpacity
  style={styles.tarjeta}
  onPress={() => {
    console.log('SE TOCÓ CREAR CUENTA');
    router.push('/registro');
  }}
>
        <View style={styles.icono}>
          <Text style={styles.iconoTexto}>🍴</Text>
        </View>

        <View style={styles.textoTarjeta}>
          <Text style={styles.tituloTarjeta}>
            Crear una cuenta 
          </Text>

          <Text style={styles.descripcionTarjeta}>
            Se parte de esta comunidad de troyanos y transforma tu vida
          
          </Text>
        </View>

        {/* Indicador */}
        <View style={styles.indicador}>
          <Text style={styles.flecha}>›</Text>
        </View>

      </TouchableOpacity>
      {/* Botón */}

      <TouchableOpacity
  style={styles.boton}
  onPress={() => router.push('/login')}
>
        <Text style={styles.textoBoton}>
          Iniciar Sesión
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f4e5c9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  titulo: {
    fontSize: 30,
    fontWeight: '500',
    color: '#252525',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 10,
  },

  troya: {
    fontWeight: '800',
    color: '#1F416A',
  },

  subtitulo: {
    fontSize: 15,
    color: '#555555',
    fontWeight: '500',
    marginBottom: 5,
  },

  troyano: {
    width: 500,
    height: 350,
    marginBottom: 0,
  },

  tarjeta: {
    width: '100%',
    minHeight: 105,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.10,
    shadowRadius: 8,

    elevation: 4,

    marginBottom: 10,
  },

  icono: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: '#2f83ea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  iconoTexto: {
    fontSize: 27,
  },

  textoTarjeta: {
    flex: 1,
  },

  tituloTarjeta: {
    fontSize: 15,
    fontWeight: '800',
    color: '#292929',
    marginBottom: 5,
  },

  descripcionTarjeta: {
    fontSize: 12,
    color: '#777777',
    lineHeight: 17,
  },

  indicador: {
    width: 42,
    height: 42,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#4D91C7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flecha: {
    fontSize: 28,
    color: '#4D91C7',
    marginTop: -4,
  },

  boton: {
    width: '100%',
    backgroundColor: '#4089C0',
    paddingVertical: 16,
    borderRadius: 28,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,

    elevation: 4,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },

});