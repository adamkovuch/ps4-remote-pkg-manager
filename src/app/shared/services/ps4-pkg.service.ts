import { Injectable } from '@angular/core';
import { ElectronService } from '../../core/services';
import * as struct from 'python-struct'

function baseConvert (num) {
  return {
    from: function (baseFrom) {
      return {
        to: function (baseTo) {
          return parseInt(num, baseFrom).toString(baseTo);
        }
      };
    }
  };
}

function le32 (bits) {
  let result: any = 0;
  let offset = 0
  for (let i = 0; i < 4; i++) {
      let byte: any = baseConvert(bits.slice(i, (i + 1)).toString("hex")).from(16).to(10);
      result |= byte << offset
      offset += 8

  }
  return parseInt(result);
}


function le16 (bits) {
  let byteA: any = baseConvert(bits.slice(0, 1).toString('hex')).from(16).to(10);
  let byteB: any = baseConvert(bits.slice(1, 2).toString('hex')).from(16).to(10);
  return parseInt((byteA | byteB << 8) as any)
}

function getTableEntry(pkg_file, offsetTableEntry, totalTableEntry, currentIndexTableEntry): Promise<FileTableEntry> {
  return new Promise((resolve, reject) => {
      let offSet = 32;
      pkg_file.seek(offsetTableEntry);
      pkg_file.once('data', chunk => {

          let tableEntry = new FileTableEntry(chunk);
          if (tableEntry.type === 0x1000) {
              resolve(tableEntry);
          }
          ++currentIndexTableEntry;
          if (currentIndexTableEntry === totalTableEntry) {
              reject();
          } else {
              offsetTableEntry = offsetTableEntry + offSet;
              return getTableEntry(pkg_file, offsetTableEntry, totalTableEntry, currentIndexTableEntry).then(data => resolve(data)).catch(error => reject(error));
          }
      });
  });
}



@Injectable({
  providedIn: 'root'
})
export class Ps4PkgService {
  constructor(private electronService: ElectronService) { }

  extract(filePath: string) {
    return new Promise((resolve, reject) => {
      if(!this.electronService.readStream) {
        resolve(null);
        return;
      }
      let resolveData = {};
      let pkgFile = new this.electronService.readStream(filePath);
      pkgFile.once('data', chunk => {
        let fileCheckData = chunk.toString('utf-8', 0, 4);
        if (fileCheckData !== '\x7FCNT') {
          reject("No pkg file");
        }

        pkgFile.seek(0x10)
        pkgFile.once('data', chunk => {

          let totalTableEntry = struct.unpack(">I", chunk, 'hex')[0];

          pkgFile.seek(0x18)
          pkgFile.once('data', chunk => {
            let offsetTableEntry = struct.unpack(">I", chunk, 'hex')[0];

            let currentIndexTableEntry = 0;
            getTableEntry(pkgFile, offsetTableEntry, totalTableEntry, currentIndexTableEntry).then(tableEntry => {

              pkgFile.seek(tableEntry.offset)
              pkgFile.once('data', data => {
                let index = 20;
                let psfHeader = new PsfHeader(data.slice(0, tableEntry.size));
                let psfLabels = data.slice(le32(psfHeader.labelPtr), tableEntry.size);
                let psfData = data.slice(le32(psfHeader.dataPtr), tableEntry.size);

                for (let i = 0; i < le32(psfHeader.sectionTotal); i++) {

                  let psfSection = new PsfSection(data.slice(index, tableEntry.size));
                  let label = psfLabels.toString('utf-8', le16(psfSection.labelOffset), psfLabels.length).split("\u0000")[0];
                  let value;
                  switch (psfSection.dataType) {
                    case 2:
                      value = psfData.toString('utf-8', le32(psfSection.dataOffset), (le32(psfSection.dataOffset) + le32(psfSection.usedDataField) - 1));
                      break;
                    case 4:
                      value = le32(psfData.slice(le32(psfSection.dataOffset), (le32(psfSection.dataOffset) + le32(psfSection.usedDataField))));
                      break;
                    default:

                      break;
                  }
                  resolveData[label] = value;
                  index += 16
                }
                pkgFile.close();
                pkgFile.destroy();
                resolve(resolveData);
              })
            }).catch(error => {
              reject(error);
            });
          })
        })
      })
    });
  }
}

class FileTableEntry {
  type: any;
  unk1: any;
  flags1: any;
  flags2: any;
  offset: any;
  size: any;

  constructor(pkg_file) {
    let data = struct.unpack('>IIIIII8x', pkg_file, 'hex');
    this.type = data[0];
    this.unk1 = data[1];
    this.flags1 = data[2];
    this.flags2 = data[3];
    this.offset = data[4];
    this.size = data[5];
  }
}

class PsfHeader {
  data: any;
  magic: any;
  rfu000: any;
  labelPtr: any;
  dataPtr: any;
  sectionTotal: any;

  constructor(bites) {
    this.data = bites;
    this.magic = le32(bites.slice(0, 4));
    this.rfu000 = le32(bites.slice(4, 8));
    this.labelPtr = bites.slice(8, 12);
    this.dataPtr = bites.slice(12, 16);
    this.sectionTotal = bites.slice(16, 20);
  }
}

class PsfSection {
  data: any;
  labelOffset: any;
  rfu001: any;
  dataType: any;
  usedDataField: any;
  sizeDataField: any;
  dataOffset: any;

  constructor(bits) {
    this.data = bits;
    this.labelOffset = bits.slice(0, 2)
    this.rfu001 = bits.slice(2, 3);
    this.dataType = parseInt(bits.toString('hex', 3, 4)); //# string = 2, integer = 4, binary = 0
    this.usedDataField = bits.slice(4, 8);
    this.sizeDataField = bits.slice(8, 12);
    this.dataOffset = bits.slice(12, 16);
  }
}